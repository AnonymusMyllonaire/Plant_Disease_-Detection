import tkinter as tk
from tkinter import filedialog, messagebox, ttk
from PIL import Image, ImageTk
import os
import threading
import cv2
import time
from backend import PlantDiseaseClassifier, DISEASE_INFO

# --- Color Palette (Neon / Dark Mode) ---
COLORS = {
    'bg_main': '#1e1e1e',       # Deep Charcoal
    'bg_card': '#2d2d2d',       # Lighter Grey for panels
    'text_main': '#ffffff',     # White
    'text_sec': '#b3b3b3',      # Light Grey
    'accent_1': '#00f2ff',      # Neon Cyan (Upload Button)
    'accent_2': '#d63031',      # Red (Disease Alert)
    'accent_3': '#fdcb6e',      # Yellow/Orange (Status)
    'neon_green': '#00ff88',    # Neon Green (Healthy/Header)
    'neon_purple': '#bc13fe'    # Neon Purple (Camera Button)
}

class ModernButton(tk.Button):
    """Custom Button with flat design and hover effects"""
    def __init__(self, master, text, command, color, **kwargs):
        super().__init__(master, text=text, command=command, **kwargs)
        self.color = color
        self.default_bg = COLORS['bg_card']
        self.configure(
            bg=self.default_bg,
            fg=self.color,
            font=('Segoe UI', 11, 'bold'),
            relief='flat',
            borderwidth=0,
            activebackground=self.color,
            activeforeground='white',
            padx=15,
            pady=8,
            cursor='hand2'
        )
        self.bind("<Enter>", self.on_enter)
        self.bind("<Leave>", self.on_leave)

    def on_enter(self, e):
        self.configure(bg=self.color, fg='white')

    def on_leave(self, e):
        self.configure(bg=self.default_bg, fg=self.color)

class PlantDiseaseGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("BioScan: Plant Disease Detector")
        self.root.geometry("1000x750")
        self.root.configure(bg=COLORS['bg_main'])
        
        # Configure Styles for Progress Bars
        self.style = ttk.Style()
        self.style.theme_use('clam')
        self.style.configure("Horizontal.TProgressbar", 
                             troughcolor=COLORS['bg_main'], 
                             background=COLORS['neon_green'],
                             bordercolor=COLORS['bg_main'])
        
        # Variables
        self.classifier = None
        # Using backend keys for consistency
        self.class_names = ['angular_leaf_spot', 'bean_rust', 'healthy']
        self.current_image_path = None
        
        self.create_widgets()
        self.load_model_thread()

    def create_widgets(self):
        # --- HEADER ---
        header_frame = tk.Frame(self.root, bg=COLORS['bg_main'])
        header_frame.pack(fill=tk.X, padx=30, pady=20)
        
        title_lbl = tk.Label(header_frame, text="BIO SCAN", 
                             font=('Segoe UI', 24, 'bold'), 
                             bg=COLORS['bg_main'], fg=COLORS['neon_green'])
        title_lbl.pack(side=tk.LEFT)
        
        subtitle_lbl = tk.Label(header_frame, text=" | AI DIAGNOSTICS", 
                                font=('Segoe UI', 14), 
                                bg=COLORS['bg_main'], fg=COLORS['text_sec'])
        subtitle_lbl.pack(side=tk.LEFT, pady=(10,0))

        self.status_lbl = tk.Label(header_frame, text="• SYSTEM INITIALIZING...", 
                                   font=('Consolas', 10), 
                                   bg=COLORS['bg_main'], fg=COLORS['accent_3'])
        self.status_lbl.pack(side=tk.RIGHT, pady=10)

        # --- MAIN CONTENT CONTAINER ---
        content_frame = tk.Frame(self.root, bg=COLORS['bg_main'])
        content_frame.pack(fill=tk.BOTH, expand=True, padx=30, pady=(0, 30))

        # === LEFT PANEL (IMAGE & INPUTS) ===
        left_panel = tk.Frame(content_frame, bg=COLORS['bg_card'], padx=20, pady=20)
        left_panel.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(0, 15))
        
        # Image Display Box
        self.img_frame = tk.Frame(left_panel, bg='black', height=400)
        self.img_frame.pack(fill=tk.BOTH, expand=True)
        self.img_frame.pack_propagate(False) # Fix size
        
        self.image_label = tk.Label(self.img_frame, text="WAITING FOR INPUT SOURCE...", 
                                    font=('Segoe UI', 10), bg='black', fg=COLORS['text_sec'])
        self.image_label.pack(fill=tk.BOTH, expand=True)

        # Buttons
        btn_container = tk.Frame(left_panel, bg=COLORS['bg_card'])
        btn_container.pack(fill=tk.X, pady=(20, 0))
        
        self.btn_upload = ModernButton(btn_container, "📁 UPLOAD FILE", 
                                       self.select_image, COLORS['accent_1'])
        self.btn_upload.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 10))
        
        self.btn_camera = ModernButton(btn_container, "📷 OPEN CAMERA", 
                                       self.open_camera, COLORS['neon_purple'])
        self.btn_camera.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(10, 0))

        # === RIGHT PANEL (RESULTS & ADVICE) ===
        right_panel = tk.Frame(content_frame, bg=COLORS['bg_card'], padx=20, pady=20)
        right_panel.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=(15, 0))

        # Result Header
        tk.Label(right_panel, text="DIAGNOSTIC RESULTS", 
                 font=('Segoe UI', 12, 'bold'), bg=COLORS['bg_card'], fg=COLORS['text_sec']).pack(anchor='w')
        
        # Big Result Text
        self.result_var = tk.StringVar(value="--")
        self.result_lbl = tk.Label(right_panel, textvariable=self.result_var,
                                   font=('Segoe UI', 22, 'bold'), 
                                   bg=COLORS['bg_card'], fg=COLORS['text_main'], wraplength=350)
        self.result_lbl.pack(fill=tk.X, pady=(10, 20))

        # Confidence Bars
        self.bars_frame = tk.Frame(right_panel, bg=COLORS['bg_card'])
        self.bars_frame.pack(fill=tk.X)
        
        self.prob_bars = {}
        for cls in self.class_names:
            row = tk.Frame(self.bars_frame, bg=COLORS['bg_card'])
            row.pack(fill=tk.X, pady=6)
            
            # Label
            tk.Label(row, text=cls.replace('_', ' ').upper(), width=18, anchor='w', 
                     font=('Consolas', 9, 'bold'), bg=COLORS['bg_card'], fg=COLORS['text_sec']).pack(side=tk.LEFT)
            
            # Percentage
            pct = tk.Label(row, text="0%", width=5, anchor='e',
                           font=('Consolas', 9), bg=COLORS['bg_card'], fg=COLORS['text_main'])
            pct.pack(side=tk.RIGHT)
            self.prob_bars[cls + "_lbl"] = pct
            
            # Bar
            bar = ttk.Progressbar(row, orient=tk.HORIZONTAL, length=100, mode='determinate', style="Horizontal.TProgressbar")
            bar.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=10)
            self.prob_bars[cls] = bar

        # Divider Line
        tk.Frame(right_panel, bg=COLORS['text_sec'], height=1).pack(fill=tk.X, pady=20)

        # Advice Section
        tk.Label(right_panel, text="ACTIONABLE INTELLIGENCE", 
                 font=('Segoe UI', 12, 'bold'), bg=COLORS['bg_card'], fg=COLORS['text_sec']).pack(anchor='w')
        
        # Dark Text Box
        self.info_text = tk.Text(right_panel, height=15, width=40, wrap=tk.WORD,
                                 font=('Segoe UI', 10), 
                                 bg='#252525', fg='#dddddd', 
                                 bd=0, padx=10, pady=10)
        self.info_text.pack(fill=tk.BOTH, expand=True, pady=(10, 0))
        self.info_text.insert("1.0", "Awaiting scan data...")
        self.info_text.configure(state=tk.DISABLED)

    def load_model_thread(self):
        thread = threading.Thread(target=self.load_model_bg)
        thread.daemon = True
        thread.start()

    def load_model_bg(self):
        try:
            self.classifier = PlantDiseaseClassifier()
            if self.classifier.model:
                self.root.after(0, lambda: self.status_lbl.configure(text="• SYSTEM READY", fg=COLORS['neon_green']))
            else:
                self.root.after(0, lambda: self.status_lbl.configure(text="• MODEL MISSING", fg=COLORS['accent_2']))
        except Exception as e:
            print(e)
            self.root.after(0, lambda: self.status_lbl.configure(text="• SYSTEM ERROR", fg=COLORS['accent_2']))

    def select_image(self):
        path = filedialog.askopenfilename(filetypes=[("Images", "*.jpg *.png *.jpeg")])
        if path:
            self.process_image(path)

    def open_camera(self):
        cap = cv2.VideoCapture(0)
        if not cap.isOpened(): return
        
        # Simple popup instructions
        top = tk.Toplevel(self.root)
        top.title("Cam")
        top.geometry("300x100")
        tk.Label(top, text="Press SPACE to Capture\nPress Q to Quit").pack(expand=True)
        
        while True:
            ret, frame = cap.read()
            if not ret: break
            cv2.imshow('BioScan Input', frame)
            k = cv2.waitKey(1)
            if k % 256 == 32: # Space pressed
                os.makedirs("captures", exist_ok=True)
                path = f"captures/cam_{int(time.time())}.jpg"
                cv2.imwrite(path, frame)
                self.process_image(path)
                break
            elif k & 0xFF == ord('q'):
                break
        cap.release()
        cv2.destroyAllWindows()
        top.destroy()

    def process_image(self, path):
        # 1. Display Image
        try:
            pil_img = Image.open(path)
            # Resize
            base_width = 400
            w_percent = (base_width / float(pil_img.size[0]))
            h_size = int((float(pil_img.size[1]) * float(w_percent)))
            if h_size > 380: h_size = 380 # Cap height
            
            pil_img = pil_img.resize((base_width, h_size), Image.Resampling.LANCZOS)
            self.tk_img = ImageTk.PhotoImage(pil_img)
            self.image_label.configure(image=self.tk_img, text="")
        except: return

        # 2. Predict
        if not self.classifier or not self.classifier.model: return
        
        result = self.classifier.predict(path)
        if 'error' in result:
             messagebox.showerror("Error", result['error'])
             return
             
        cls_name = result['class_name']     # Display name (e.g. "Angular Leaf Spot")
        conf = result['confidence']
        probabilities = result['probabilities']
        
        # 3. Update UI Elements
        # Change color based on health (Green if healthy, Red if sick)
        # Note: backend returns 'Healthy' as name for 'healthy' class
        color = COLORS['neon_green'] if cls_name == "Healthy" else COLORS['accent_2']
        
        self.result_var.set(f"{cls_name.upper()}")
        self.result_lbl.configure(fg=color)
        
        # Update Bars
        # Map backend keys to the list order we want or just iterate keys
        # We initialized self.class_names with keys ['angular_leaf_spot',...] in __init__
        # But the UI labels need to match the backend keys to find the right bar.
        # Wait, the UI bars were created using 'self.class_names'.
        # Let's fix the bars update loop.
        
        for key in self.class_names:
            val = probabilities.get(key, 0.0)
            # Find the UI elements associated with this key?
            # In __init__, we need to make sure prob_bars are keyed by the backend keys.
            if key in self.prob_bars:
                self.prob_bars[key]['value'] = val * 100
                self.prob_bars[key + "_lbl"].configure(text=f"{int(val*100)}%")
            
        # Update Advice Text
        txt = f"SYMPTOMS DETECTED:\n{result['symptoms']}\n\nRECOMMENDED PROTOCOL:\n{result['cure']}"
        
        self.info_text.configure(state=tk.NORMAL)
        self.info_text.delete("1.0", tk.END)
        self.info_text.insert("1.0", txt)
        
        # Add coloring to headers inside text box
        self.info_text.tag_add("header", "1.0", "1.18")
        self.info_text.tag_add("header", "3.0", "3.22")
        self.info_text.tag_config("header", foreground=COLORS['accent_1'], font=('Segoe UI', 10, 'bold'))
        
        self.info_text.configure(state=tk.DISABLED)

if __name__ == "__main__":
    root = tk.Tk()
    app = PlantDiseaseGUI(root)
    root.mainloop()
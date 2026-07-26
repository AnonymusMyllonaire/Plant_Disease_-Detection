// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface PredictionResult {
    class_key: string;
    class_name: string;
    confidence: number;
    probabilities: {
        angular_leaf_spot: number;
        bean_rust: number;
        healthy: number;
    };
    symptoms: string;
    cure: string;
}

export interface PredictionError {
    error: string;
}

/**
 * Upload an image file and get disease prediction
 */
export async function predictDisease(file: File): Promise<PredictionResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if ('error' in data) {
        throw new Error(data.error);
    }

    return data as PredictionResult;
}

/**
 * Check if the API server is running
 */
export async function checkApiHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/`);
        return response.ok;
    } catch {
        return false;
    }
}

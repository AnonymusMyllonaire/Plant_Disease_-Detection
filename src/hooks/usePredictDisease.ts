import { useMutation } from '@tanstack/react-query';
import { predictDisease, type PredictionResult } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function usePredictDisease() {
    const { toast } = useToast();

    return useMutation({
        mutationFn: (file: File) => predictDisease(file),
        onError: (error: Error) => {
            toast({
                variant: 'destructive',
                title: 'Analysis Failed',
                description: error.message || 'Failed to analyze the image. Please try again.',
            });
        },
    });
}

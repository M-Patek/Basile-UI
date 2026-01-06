import { useEffect } from 'react';

// Helper Hook to load external scripts for Highlighting and Math
const useExternalLib = () => {
    useEffect(() => {
        const loadStyle = (href) => {
            if (!document.querySelector(`link[href="${href}"]`)) {
                const link = document.createElement('link');
                link.href = href;
                link.rel = 'stylesheet';
                document.head.appendChild(link);
            }
        };

        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                if (document.querySelector(`script[src="${src}"]`)) {
                    resolve();
                    return;
                }
                const script = document.createElement('script');
                script.src = src;
                script.async = true;
                script.onload = resolve;
                script.onerror = reject;
                document.body.appendChild(script);
            });
        };

        const init = async () => {
            loadStyle('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css');
            loadStyle('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css');

            try {
                await Promise.all([
                    loadScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js'),
                    loadScript('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js')
                ]);

                await Promise.all([
                    loadScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js'),
                    loadScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js'),
                    loadScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-jsx.min.js'),
                    loadScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-css.min.js'),
                    loadScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-bash.min.js'),
                    loadScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-json.min.js')
                ]);
            } catch (error) {
                console.error("Failed to load external libraries", error);
            }
        };

        init();
    }, []);
};

export default useExternalLib;

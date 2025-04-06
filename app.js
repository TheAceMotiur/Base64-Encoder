const { createApp, ref, computed, watch } = Vue;

createApp({
    setup() {
        const inputText = ref('');
        const outputText = ref('');
        const copyButtonText = ref('Copy');
        const autoMode = ref(true);
        const showTutorial = ref(false);
        const showSupport = ref(false);
        const mode = ref('text'); // 'text' or 'image'
        
        // Image mode state
        const imagePreview = ref('');
        const base64Output = ref('');
        const base64Input = ref('');
        const decodedImage = ref('');
        
        const inputCharCount = computed(() => inputText.value.length);
        const outputCharCount = computed(() => outputText.value.length);
        
        // Analytics tracking for feature usage
        const trackFeatureUsage = (feature) => {
            if (window.gtag) {
                gtag('event', 'feature_used', {
                    'feature_name': feature
                });
            }
        };

        // Set the mode (text or image)
        const setMode = (newMode) => {
            mode.value = newMode;
            clearAll();
            trackFeatureUsage(`switch_to_${newMode}_mode`);
        };

        // Text mode functions
        const encode = () => {
            try {
                if (inputText.value) {
                    outputText.value = btoa(inputText.value);
                    trackFeatureUsage('text_encode');
                }
            } catch (e) {
                outputText.value = 'Error: Unable to encode. Make sure your input contains valid characters.';
            }
        };

        const decode = () => {
            try {
                if (inputText.value) {
                    outputText.value = atob(inputText.value);
                    trackFeatureUsage('text_decode');
                }
            } catch (e) {
                outputText.value = 'Error: Unable to decode. Make sure your input is valid Base64.';
            }
        };

        const autoProcess = () => {
            if (!autoMode.value) return;
            
            // Try to detect if the input is likely Base64
            const isLikelyBase64 = /^[A-Za-z0-9+/=]+$/.test(inputText.value) && 
                                  (inputText.value.length % 4 === 0);
            
            if (isLikelyBase64) {
                try {
                    const decoded = atob(inputText.value);
                    outputText.value = decoded;
                } catch (e) {
                    // If decoding fails, try encoding instead
                    encode();
                }
            } else {
                // If not likely Base64, just encode
                encode();
            }
        };

        // Image mode functions
        const handleImageUpload = (event) => {
            const file = event.target.files[0];
            if (!file) return;
            
            // Check if file is an image
            if (!file.type.match('image.*')) {
                alert('Please select an image file');
                return;
            }
            
            // Check file size (limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size should be less than 5MB');
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = (e) => {
                imagePreview.value = e.target.result;
                base64Output.value = e.target.result;
                trackFeatureUsage('image_encode');
            };
            
            reader.readAsDataURL(file);
        };
        
        const decodeBase64ToImage = () => {
            if (!base64Input.value) {
                alert('Please enter a Base64 string');
                return;
            }
            
            try {
                // Check if the string is a valid data URL
                if (!base64Input.value.startsWith('data:image/')) {
                    throw new Error('Invalid image Base64 string. It should start with "data:image/"');
                }
                
                decodedImage.value = base64Input.value;
                trackFeatureUsage('image_decode');
            } catch (e) {
                alert(e.message || 'Invalid Base64 string');
            }
        };
        
        const copyImageBase64 = async () => {
            if (!base64Output.value) return;
            
            try {
                await navigator.clipboard.writeText(base64Output.value);
                copyButtonText.value = 'Copied!';
                setTimeout(() => {
                    copyButtonText.value = 'Copy';
                }, 2000);
                trackFeatureUsage('copy_image_base64');
            } catch (e) {
                copyButtonText.value = 'Failed to copy';
                setTimeout(() => {
                    copyButtonText.value = 'Copy';
                }, 2000);
            }
        };
        
        const clearImageMode = () => {
            imagePreview.value = '';
            base64Output.value = '';
            base64Input.value = '';
            decodedImage.value = '';
            // Reset file input by creating a new instance
            const fileInput = document.getElementById('imageUpload');
            if (fileInput) fileInput.value = '';
        };

        // Common functions
        const clearAll = () => {
            if (mode.value === 'text') {
                inputText.value = '';
                outputText.value = '';
            } else {
                clearImageMode();
            }
            trackFeatureUsage('clear_all');
        };

        const copyToClipboard = async () => {
            if (!outputText.value) return;
            
            try {
                await navigator.clipboard.writeText(outputText.value);
                copyButtonText.value = 'Copied!';
                setTimeout(() => {
                    copyButtonText.value = 'Copy';
                }, 2000);
                trackFeatureUsage('copy_text_output');
            } catch (e) {
                copyButtonText.value = 'Failed to copy';
                setTimeout(() => {
                    copyButtonText.value = 'Copy';
                }, 2000);
            }
        };

        // Social sharing functions
        const shareOnSocial = (platform) => {
            let shareUrl = '';
            const pageUrl = encodeURIComponent(window.location.href);
            const pageTitle = encodeURIComponent('Base64 Encoder/Decoder Tool');
            const pageDescription = encodeURIComponent('Free online tool to encode and decode text and images using Base64');
            
            switch(platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageDescription}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${pageTitle}&summary=${pageDescription}`;
                    break;
                case 'reddit':
                    shareUrl = `https://reddit.com/submit?url=${pageUrl}&title=${pageTitle}`;
                    break;
                case 'pinterest':
                    shareUrl = `https://pinterest.com/pin/create/button/?url=${pageUrl}&description=${pageDescription}`;
                    break;
                case 'telegram':
                    shareUrl = `https://t.me/share/url?url=${pageUrl}&text=${pageDescription}`;
                    break;
                case 'email':
                    shareUrl = `mailto:?subject=${pageTitle}&body=${pageDescription}%0A%0A${pageUrl}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank');
                trackFeatureUsage(`share_${platform}`);
            }
        };

        return {
            // Text mode
            inputText,
            outputText,
            inputCharCount,
            outputCharCount,
            encode,
            decode,
            autoProcess,
            
            // Image mode
            mode,
            setMode,
            imagePreview,
            base64Output,
            base64Input,
            decodedImage,
            handleImageUpload,
            decodeBase64ToImage,
            copyImageBase64,
            clearImageMode,
            
            // Common
            copyButtonText,
            showTutorial,
            showSupport,
            clearAll,
            copyToClipboard,
            
            // Social sharing
            shareOnSocial
        };
    }
}).mount('#app');

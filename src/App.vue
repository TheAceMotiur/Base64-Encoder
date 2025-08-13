<script setup>
import { ref, onMounted } from 'vue'

// State management
const inputText = ref('')
const encodedOutput = ref('')
const decodedOutput = ref('')
const activeTab = ref('encode')
const currentPage = ref('home')
const isMobileMenuOpen = ref(false)

// Image handling state
const selectedFile = ref(null)
const imagePreview = ref('')
const imageBase64 = ref('')
const decodedImage = ref('')
const activeImageTab = ref('image-encode')
const dragOver = ref(false)

// Navigation items
const navigation = [
  { name: 'Home', href: 'home', current: true },
  { name: 'FAQ', href: 'faq', current: false },
  { name: 'About', href: 'about', current: false },
  { name: 'Contact', href: 'contact', current: false }
]

// Base64 functions
const encodeToBase64 = () => {
  try {
    encodedOutput.value = btoa(unescape(encodeURIComponent(inputText.value)))
  } catch (error) {
    encodedOutput.value = 'Error: Invalid input for encoding'
  }
}

const decodeFromBase64 = () => {
  try {
    decodedOutput.value = decodeURIComponent(escape(atob(inputText.value)))
  } catch (error) {
    decodedOutput.value = 'Error: Invalid Base64 string'
  }
}

const clearAll = () => {
  inputText.value = ''
  encodedOutput.value = ''
  decodedOutput.value = ''
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    // You could add a toast notification here
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

const switchTab = (tab) => {
  activeTab.value = tab
  clearAll()
}

const switchImageTab = (tab) => {
  activeImageTab.value = tab
  clearImageData()
}

// Image handling functions
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    processImageFile(file)
  }
}

const handleFileDrop = (event) => {
  event.preventDefault()
  dragOver.value = false
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    processImageFile(file)
  }
}

const handleDragOver = (event) => {
  event.preventDefault()
  dragOver.value = true
}

const handleDragLeave = () => {
  dragOver.value = false
}

const processImageFile = (file) => {
  selectedFile.value = file
  const reader = new FileReader()
  
  reader.onload = (e) => {
    imagePreview.value = e.target.result
    // Remove data URL prefix to get just the base64 string
    imageBase64.value = e.target.result.split(',')[1]
  }
  
  reader.readAsDataURL(file)
}

const downloadImage = () => {
  if (decodedImage.value) {
    const link = document.createElement('a')
    link.href = decodedImage.value
    link.download = 'decoded-image.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

const decodeImageFromBase64 = () => {
  try {
    // Check if input has data URL prefix
    let base64Data = inputText.value.trim()
    
    // If it doesn't start with data:, assume it's just the base64 string
    if (!base64Data.startsWith('data:')) {
      // Try to detect image type or default to PNG
      base64Data = `data:image/png;base64,${base64Data}`
    }
    
    // Validate base64
    const base64String = base64Data.split(',')[1]
    atob(base64String) // This will throw if invalid
    
    decodedImage.value = base64Data
  } catch (error) {
    decodedImage.value = ''
    alert('Error: Invalid Base64 image data')
  }
}

const clearImageData = () => {
  selectedFile.value = null
  imagePreview.value = ''
  imageBase64.value = ''
  decodedImage.value = ''
  inputText.value = ''
}

const navigateTo = (page) => {
  currentPage.value = page
  isMobileMenuOpen.value = false
  // Update navigation current state
  navigation.forEach(item => {
    item.current = item.href === page
  })
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Close mobile menu when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.mobile-menu-container')) {
      isMobileMenuOpen.value = false
    }
  })
  
  // Initialize AdSense ads
  if (typeof window !== 'undefined' && window.adsbygoogle) {
    // Push ads after a short delay to ensure DOM is ready
    setTimeout(() => {
      try {
        const ads = document.querySelectorAll('.adsbygoogle')
        ads.forEach(() => {
          (window.adsbygoogle = window.adsbygoogle || []).push({})
        })
      } catch (error) {
        console.log('AdSense initialization error:', error)
      }
    }, 1000)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <nav class="px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <button @click="navigateTo('home')" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">B64</span>
              </div>
              <span class="text-xl font-bold text-gray-900 hidden sm:block">Base64-Encoder</span>
              <span class="text-xl font-bold text-gray-900 sm:hidden">B64</span>
            </button>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden lg:block">
            <div class="ml-10 flex items-baseline space-x-6">
              <button
                v-for="item in navigation"
                :key="item.name"
                @click="navigateTo(item.href)"
                :class="[
                  item.current
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200'
                ]"
              >
                {{ item.name }}
              </button>
            </div>
          </div>

          <!-- Tablet Navigation -->
          <div class="hidden md:block lg:hidden">
            <div class="ml-6 flex items-baseline space-x-3">
              <button
                v-for="item in navigation"
                :key="item.name"
                @click="navigateTo(item.href)"
                :class="[
                  item.current
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                  'px-3 py-2 rounded-md text-xs font-medium transition-colors duration-200'
                ]"
              >
                {{ item.name }}
              </button>
            </div>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden mobile-menu-container">
            <button
              @click="toggleMobileMenu"
              class="bg-gray-100 inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors duration-200"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation Menu -->
        <div v-show="isMobileMenuOpen" class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <button
              v-for="item in navigation"
              :key="item.name"
              @click="navigateTo(item.href)"
              :class="[
                item.current
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                'block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200'
              ]"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <!-- Home Page -->
      <div v-if="currentPage === 'home'">
        <!-- Hero Section -->
        <section class="bg-white border-b border-gray-200">
          <div class="px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <div class="text-center max-w-7xl mx-auto">
              <h1 class="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Professional Base64 
                <span class="text-gray-600">Encoder & Decoder</span>
              </h1>
              <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Fast, secure, and reliable Base64 encoding and decoding tool. 
                Convert text to Base64 and decode Base64 strings with our professional online converter at Base64-Encoder.com.
              </p>
              <button
                @click="navigateTo('tools')"
                class="bg-gray-900 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors duration-200"
              >
                Start Converting
              </button>
            </div>
          </div>
        </section>

        <!-- AdSense Ad - Above the fold -->
        <section class="py-8 bg-white">
          <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
            <!-- Responsive Ad -->
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-9354746037074515"
                 data-ad-slot="7755725804"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
          </div>
        </section>

        <!-- Features Section -->
        <section class="py-16 lg:py-24">
          <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div class="text-center mb-16">
              <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose Our Tools?</h2>
              <p class="text-xl text-gray-600">Professional-grade features for all your Base64 needs</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div class="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                <p class="text-gray-600">Instant encoding and decoding with optimized algorithms for maximum performance.</p>
              </div>

              <div class="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">100% Secure</h3>
                <p class="text-gray-600">All processing happens in your browser. Your data never leaves your device.</p>
              </div>

              <div class="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">UTF-8 Support</h3>
                <p class="text-gray-600">Full Unicode support for international characters and emojis.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- AdSense Ad - Between Features and Tools -->
        <section class="py-8 bg-gray-100">
          <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
            <!-- Responsive Ad -->
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-9354746037074515"
                 data-ad-slot="7755725804"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
          </div>
        </section>

        <!-- Interactive Tools Section -->
        <section class="py-16 lg:py-24 bg-white">
          <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div class="text-center mb-12">
              <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Try Our Base64 Tools</h2>
              <p class="text-xl text-gray-600 mb-8">Experience instant encoding and decoding right here on our homepage</p>
            </div>

            <!-- Tab Navigation -->
            <div class="flex justify-center border-b border-gray-200 mb-8">
              <button
                @click="switchTab('encode')"
                :class="[
                  'px-6 py-3 font-medium text-sm border-b-2 transition-colors duration-200',
                  activeTab === 'encode'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                Encode to Base64
              </button>
              <button
                @click="switchTab('decode')"
                :class="[
                  'px-6 py-3 font-medium text-sm border-b-2 transition-colors duration-200',
                  activeTab === 'decode'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                Decode from Base64
              </button>
            </div>

            <!-- Encode Tool -->
            <div v-if="activeTab === 'encode'" class="max-w-4xl mx-auto space-y-6">
              <div class="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <label class="block text-sm font-medium text-gray-700 mb-3">
                  Enter text to encode to Base64
                </label>
                <textarea
                  v-model="inputText"
                  placeholder="Type or paste your text here..."
                  class="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 resize-none transition-colors duration-200 bg-white"
                ></textarea>
                <div class="flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    @click="encodeToBase64"
                    class="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
                  >
                    Encode to Base64
                  </button>
                  <button
                    @click="clearAll"
                    class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div v-if="encodedOutput" class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div class="flex justify-between items-center mb-3">
                  <label class="text-sm font-medium text-gray-700">
                    Base64 Encoded Result
                  </label>
                  <button
                    @click="copyToClipboard(encodedOutput)"
                    class="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 px-3 py-1 border border-gray-300 rounded"
                  >
                    Copy to Clipboard
                  </button>
                </div>
                <div class="bg-gray-50 rounded-lg p-4 font-mono text-sm break-all border min-h-[100px] overflow-auto">
                  {{ encodedOutput }}
                </div>
              </div>
            </div>

            <!-- Decode Tool -->
            <div v-if="activeTab === 'decode'" class="max-w-4xl mx-auto space-y-6">
              <div class="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <label class="block text-sm font-medium text-gray-700 mb-3">
                  Enter Base64 string to decode
                </label>
                <textarea
                  v-model="inputText"
                  placeholder="Paste your Base64 encoded string here..."
                  class="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 resize-none transition-colors duration-200 font-mono bg-white"
                ></textarea>
                <div class="flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    @click="decodeFromBase64"
                    class="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
                  >
                    Decode from Base64
                  </button>
                  <button
                    @click="clearAll"
                    class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div v-if="decodedOutput" class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div class="flex justify-between items-center mb-3">
                  <label class="text-sm font-medium text-gray-700">
                    Decoded Result
                  </label>
                  <button
                    @click="copyToClipboard(decodedOutput)"
                    class="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 px-3 py-1 border border-gray-300 rounded"
                  >
                    Copy to Clipboard
                  </button>
                </div>
                <div class="bg-gray-50 rounded-lg p-4 break-all border min-h-[100px] overflow-auto">
                  {{ decodedOutput }}
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- AdSense Ad - Between Text and Image Tools -->
        <section class="py-8 bg-white">
          <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
            <!-- Responsive Ad -->
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-9354746037074515"
                 data-ad-slot="7755725804"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
          </div>
        </section>

        <!-- Image Tools Section -->
        <section class="py-16 lg:py-24 bg-gray-50">
          <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div class="text-center mb-12">
              <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Base64 Image Tools</h2>
              <p class="text-xl text-gray-600 mb-8">Convert images to Base64 and decode Base64 strings back to images</p>
            </div>

            <!-- Image Tab Navigation -->
            <div class="flex justify-center border-b border-gray-200 mb-8">
              <button
                @click="switchImageTab('image-encode')"
                :class="[
                  'px-6 py-3 font-medium text-sm border-b-2 transition-colors duration-200',
                  activeImageTab === 'image-encode'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                Image to Base64
              </button>
              <button
                @click="switchImageTab('image-decode')"
                :class="[
                  'px-6 py-3 font-medium text-sm border-b-2 transition-colors duration-200',
                  activeImageTab === 'image-decode'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                Base64 to Image
              </button>
            </div>

            <!-- Image Encode Tool -->
            <div v-if="activeImageTab === 'image-encode'" class="max-w-4xl mx-auto space-y-6">
              <div class="bg-white rounded-lg border border-gray-200 p-6">
                <label class="block text-sm font-medium text-gray-700 mb-3">
                  Upload an image to convert to Base64
                </label>
                
                <!-- File Drop Zone -->
                <div 
                  @drop="handleFileDrop"
                  @dragover="handleDragOver"
                  @dragleave="handleDragLeave"
                  :class="[
                    'border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200',
                    dragOver 
                      ? 'border-gray-400 bg-gray-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  ]"
                >
                  <div v-if="!imagePreview" class="space-y-4">
                    <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <div>
                      <p class="text-gray-600">
                        <span class="font-medium text-gray-900">Click to upload</span> or drag and drop
                      </p>
                      <p class="text-sm text-gray-500">PNG, JPG, GIF, WebP up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      @change="handleFileSelect"
                      class="hidden"
                      id="imageUpload"
                    >
                    <label
                      for="imageUpload"
                      class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      Choose File
                    </label>
                  </div>
                  
                  <!-- Image Preview -->
                  <div v-else class="space-y-4">
                    <img :src="imagePreview" alt="Preview" class="max-h-64 mx-auto rounded-lg shadow-sm">
                    <div class="text-sm text-gray-600">
                      <p><strong>File:</strong> {{ selectedFile?.name }}</p>
                      <p><strong>Size:</strong> {{ (selectedFile?.size / 1024).toFixed(1) }} KB</p>
                      <p><strong>Type:</strong> {{ selectedFile?.type }}</p>
                    </div>
                    <button
                      @click="clearImageData"
                      class="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              </div>

              <!-- Base64 Output for Images -->
              <div v-if="imageBase64" class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div class="flex justify-between items-center mb-3">
                  <label class="text-sm font-medium text-gray-700">
                    Base64 Image Data
                  </label>
                  <div class="flex gap-2">
                    <button
                      @click="copyToClipboard(imageBase64)"
                      class="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 px-3 py-1 border border-gray-300 rounded"
                    >
                      Copy Base64
                    </button>
                    <button
                      @click="copyToClipboard(imagePreview)"
                      class="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 px-3 py-1 border border-gray-300 rounded"
                    >
                      Copy Data URL
                    </button>
                  </div>
                </div>
                <div class="bg-gray-50 rounded-lg p-4 font-mono text-xs break-all border max-h-48 overflow-auto">
                  {{ imageBase64 }}
                </div>
                <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p class="text-sm text-blue-800">
                    <strong>Data URL format:</strong> <code class="bg-white px-1 rounded">data:{{ selectedFile?.type }};base64,{{ imageBase64.substring(0, 50) }}...</code>
                  </p>
                </div>
              </div>
            </div>

            <!-- Image Decode Tool -->
            <div v-if="activeImageTab === 'image-decode'" class="max-w-4xl mx-auto space-y-6">
              <div class="bg-white rounded-lg border border-gray-200 p-6">
                <label class="block text-sm font-medium text-gray-700 mb-3">
                  Enter Base64 image data to decode
                </label>
                <textarea
                  v-model="inputText"
                  placeholder="Paste Base64 image data here (with or without data URL prefix)..."
                  class="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 resize-none transition-colors duration-200 font-mono text-sm"
                ></textarea>
                <div class="flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    @click="decodeImageFromBase64"
                    class="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
                  >
                    Decode to Image
                  </button>
                  <button
                    @click="clearImageData"
                    class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p class="text-sm text-yellow-800">
                    <strong>Tip:</strong> You can paste either just the Base64 string or the complete data URL (data:image/png;base64,...)
                  </p>
                </div>
              </div>

              <!-- Decoded Image Output -->
              <div v-if="decodedImage" class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div class="flex justify-between items-center mb-3">
                  <label class="text-sm font-medium text-gray-700">
                    Decoded Image
                  </label>
                  <button
                    @click="downloadImage"
                    class="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 px-3 py-1 border border-gray-300 rounded"
                  >
                    Download Image
                  </button>
                </div>
                <div class="bg-gray-50 rounded-lg p-4 border text-center">
                  <img :src="decodedImage" alt="Decoded" class="max-h-96 mx-auto rounded-lg shadow-sm">
                </div>
              </div>
            </div>

            <!-- Image Tools Info -->
            <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Multiple Formats</h3>
                <p class="text-gray-600">Support for PNG, JPG, GIF, WebP, and other common image formats</p>
              </div>

              <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Drag & Drop</h3>
                <p class="text-gray-600">Easy file upload with drag and drop functionality for quick conversions</p>
              </div>

              <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Client-Side Processing</h3>
                <p class="text-gray-600">All image processing happens in your browser - your images never leave your device</p>
              </div>
            </div>
          </div>
        </section>

        <!-- AdSense Ad - Between Image Tools and Information -->
        <section class="py-8 bg-gray-100">
          <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
            <!-- Responsive Ad -->
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-9354746037074515"
                 data-ad-slot="7755725804"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
          </div>
        </section>

        <!-- Information Section -->
        <section class="py-16 lg:py-24 bg-gray-50">
          <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  What is Base64 Encoding?
                </h2>
                <div class="space-y-4 text-gray-600">
                  <p class="text-lg">
                    Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. 
                    It's designed to carry data stored in binary formats across channels that only reliably support text content.
                  </p>
                  <p>
                    Base64 encoding is commonly used in various applications including email systems, data URLs, 
                    web development, and API communications. It ensures that binary data remains intact without 
                    modification during transport through text-only systems.
                  </p>
                  <p>
                    Our tool provides a simple, fast, and secure way to encode text to Base64 and decode Base64 
                    strings back to readable text, with full support for UTF-8 characters including international 
                    languages and special characters.
                  </p>
                </div>
                <div class="mt-8">
                  <button
                    @click="navigateTo('about')"
                    class="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Learn More About Base64
                    <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div class="space-y-6">
                <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 class="text-lg font-semibold text-gray-900 mb-3">Common Use Cases</h3>
                  <ul class="space-y-2 text-gray-600">
                    <li class="flex items-center">
                      <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      Email attachment encoding
                    </li>
                    <li class="flex items-center">
                      <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      Data URLs in web development
                    </li>
                    <li class="flex items-center">
                      <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      API authentication tokens
                    </li>
                    <li class="flex items-center">
                      <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      Storing binary data in JSON
                    </li>
                    <li class="flex items-center">
                      <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      Image embedding in CSS/HTML
                    </li>
                  </ul>
                </div>

                <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 class="text-lg font-semibold text-gray-900 mb-3">Security & Privacy</h3>
                  <div class="space-y-3 text-gray-600">
                    <div class="flex items-start">
                      <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                      </svg>
                      <div>
                        <strong>Client-side processing:</strong> All encoding and decoding happens in your browser
                      </div>
                    </div>
                    <div class="flex items-start">
                      <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                      </svg>
                      <div>
                        <strong>No data storage:</strong> Your information never leaves your device
                      </div>
                    </div>
                    <div class="flex items-start">
                      <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                      </svg>
                      <div>
                        <strong>HTTPS encryption:</strong> Secure connection for all communications
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- AdSense Ad - Before Call to Action -->
        <section class="py-8 bg-white">
          <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
            <!-- Responsive Ad -->
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-9354746037074515"
                 data-ad-slot="7755725804"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
          </div>
        </section>

        <!-- Call to Action Section -->
        <section class="py-16 lg:py-24 bg-gray-900">
          <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
            <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Start Converting?
            </h2>
            <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of developers and IT professionals who trust Base64-Encoder.com for their encoding and decoding needs.
            </p>
            <div class="flex justify-center">
              <button
                @click="navigateTo('faq')"
                class="px-8 py-3 border border-gray-600 text-white rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors duration-200"
              >
                View FAQ
              </button>
            </div>
          </div>
        </section>
      </div>

      <!-- Tools Page -->
      <div v-if="currentPage === 'tools'" class="py-8">
        <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Base64 Conversion Tool</h1>
            <p class="text-gray-600">Encode and decode Base64 strings with our professional online converter</p>
          </div>

          <!-- Tab Navigation -->
          <div class="flex border-b border-gray-200 mb-8">
            <button
              @click="switchTab('encode')"
              :class="[
                'px-6 py-3 font-medium text-sm border-b-2 transition-colors duration-200',
                activeTab === 'encode'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Encode to Base64
            </button>
            <button
              @click="switchTab('decode')"
              :class="[
                'px-6 py-3 font-medium text-sm border-b-2 transition-colors duration-200',
                activeTab === 'decode'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Decode from Base64
            </button>
          </div>

          <!-- Encode Tab -->
          <div v-if="activeTab === 'encode'" class="space-y-6">
            <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Input Text
              </label>
              <textarea
                v-model="inputText"
                placeholder="Enter text to encode to Base64..."
                class="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 resize-none transition-colors duration-200"
              ></textarea>
              <div class="flex gap-3 mt-4">
                <button
                  @click="encodeToBase64"
                  class="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
                >
                  Encode
                </button>
                <button
                  @click="clearAll"
                  class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Clear
                </button>
              </div>
            </div>

            <div v-if="encodedOutput" class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div class="flex justify-between items-center mb-3">
                <label class="text-sm font-medium text-gray-700">
                  Base64 Output
                </label>
                <button
                  @click="copyToClipboard(encodedOutput)"
                  class="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  Copy to clipboard
                </button>
              </div>
              <div class="bg-gray-50 rounded-lg p-4 font-mono text-sm break-all border">
                {{ encodedOutput }}
              </div>
            </div>
          </div>

          <!-- Decode Tab -->
          <div v-if="activeTab === 'decode'" class="space-y-6">
            <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Base64 Input
              </label>
              <textarea
                v-model="inputText"
                placeholder="Enter Base64 string to decode..."
                class="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 resize-none transition-colors duration-200 font-mono"
              ></textarea>
              <div class="flex gap-3 mt-4">
                <button
                  @click="decodeFromBase64"
                  class="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
                >
                  Decode
                </button>
                <button
                  @click="clearAll"
                  class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Clear
                </button>
              </div>
            </div>

            <div v-if="decodedOutput" class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div class="flex justify-between items-center mb-3">
                <label class="text-sm font-medium text-gray-700">
                  Decoded Output
                </label>
                <button
                  @click="copyToClipboard(decodedOutput)"
                  class="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  Copy to clipboard
                </button>
              </div>
              <div class="bg-gray-50 rounded-lg p-4 break-all border">
                {{ decodedOutput }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- About Page -->
      <div v-if="currentPage === 'about'" class="py-16">
        <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">About Base64-Encoder.com</h1>
            <p class="text-xl text-gray-600">Professional encoding and decoding tool for developers and IT professionals</p>
          </div>

          <div class="prose prose-lg max-w-none">
            <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-8 mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">What is Base64?</h2>
              <p class="text-gray-600 mb-4">
                Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. 
                It's commonly used in web development, email systems, and data storage to encode binary data 
                that needs to be transmitted or stored in text-only environments.
              </p>
              <p class="text-gray-600">
                Our tool provides a simple, secure, and fast way to encode text to Base64 and decode Base64 strings 
                back to readable text, with full support for UTF-8 characters and international text.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h3 class="text-xl font-semibold text-gray-900 mb-3">Common Use Cases</h3>
                <ul class="space-y-2 text-gray-600">
                  <li>• Email attachments</li>
                  <li>• Data URLs in web development</li>
                  <li>• API authentication tokens</li>
                  <li>• Storing binary data in JSON</li>
                  <li>• Image embedding in CSS/HTML</li>
                </ul>
              </div>

              <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h3 class="text-xl font-semibold text-gray-900 mb-3">Why Choose Us?</h3>
                <ul class="space-y-2 text-gray-600">
                  <li>• 100% client-side processing</li>
                  <li>• No data stored on servers</li>
                  <li>• Fast and reliable conversion</li>
                  <li>• Mobile-friendly interface</li>
                  <li>• Free to use forever</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ Page -->
      <div v-if="currentPage === 'faq'" class="py-16">
        <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
            <p class="text-xl text-gray-600">Common questions about our Base64 encoding and decoding tool</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- General Questions -->
            <div class="space-y-6">
              <h2 class="text-2xl font-semibold text-gray-900 mb-6">General Questions</h2>
              
              <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <details class="group">
                  <summary class="flex cursor-pointer items-center justify-between text-gray-900 font-medium text-lg">
                    <span>What is Base64 encoding?</span>
                    <svg class="h-5 w-5 group-open:rotate-180 transition-transform text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </summary>
                  <div class="mt-4 text-gray-600">
                    <p>Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format by translating it into a radix-64 representation. It's commonly used in web development, email systems, and data storage.</p>
                  </div>
                </details>
              </div>

              <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <details class="group">
                  <summary class="flex cursor-pointer items-center justify-between text-gray-900 font-medium text-lg">
                    <span>Is my data secure?</span>
                    <svg class="h-5 w-5 group-open:rotate-180 transition-transform text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </summary>
                  <div class="mt-4 text-gray-600">
                    <p>Yes, absolutely! All processing happens in your browser using client-side JavaScript. Your data never leaves your device and is not sent to our servers. We have a zero-data policy.</p>
                  </div>
                </details>
              </div>

              <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <details class="group">
                  <summary class="flex cursor-pointer items-center justify-between text-gray-900 font-medium text-lg">
                    <span>What file formats are supported?</span>
                    <svg class="h-5 w-5 group-open:rotate-180 transition-transform text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </summary>
                  <div class="mt-4 text-gray-600">
                    <p>Currently, our tool supports text input only. You can encode any UTF-8 text including special characters, emojis, and international languages. File upload support is coming soon.</p>
                  </div>
                </details>
              </div>

              <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <details class="group">
                  <summary class="flex cursor-pointer items-center justify-between text-gray-900 font-medium text-lg">
                    <span>Is there a character limit?</span>
                    <svg class="h-5 w-5 group-open:rotate-180 transition-transform text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </summary>
                  <div class="mt-4 text-gray-600">
                    <p>There's no hard limit imposed by our tool. The limit depends on your browser's memory capacity. Most modern browsers can handle large text files efficiently.</p>
                  </div>
                </details>
              </div>
            </div>

            <!-- Technical Questions -->
            <div class="space-y-6">
              <h2 class="text-2xl font-semibold text-gray-900 mb-6">Technical Questions</h2>
              
              <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <details class="group">
                  <summary class="flex cursor-pointer items-center justify-between text-gray-900 font-medium text-lg">
                    <span>How do I integrate this into my website?</span>
                    <svg class="h-5 w-5 group-open:rotate-180 transition-transform text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </summary>
                  <div class="mt-4 text-gray-600">
                    <p>You can embed our JavaScript functions in your website or use the tool directly. Our Base64 encoding and decoding functions are available for integration into your applications.</p>
                  </div>
                </details>
              </div>

              <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <details class="group">
                  <summary class="flex cursor-pointer items-center justify-between text-gray-900 font-medium text-lg">
                    <span>Do you store uploaded data?</span>
                    <svg class="h-5 w-5 group-open:rotate-180 transition-transform text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </summary>
                  <div class="mt-4 text-gray-600">
                    <p>No, we don't store any uploaded data. All encoding and decoding operations are performed client-side in your browser. We have no servers that process or store your content.</p>
                  </div>
                </details>
              </div>
            </div>
          </div>

          <!-- Contact Section -->
          <div class="mt-16 bg-gray-50 rounded-lg p-8 text-center">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Still have questions?</h3>
            <p class="text-gray-600 mb-6">Can't find the answer you're looking for? Please get in touch with our team.</p>
            <button 
              @click="navigateTo('contact')"
              class="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>

      <!-- Contact Page -->
      <div v-if="currentPage === 'contact'" class="py-16">
        <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p class="text-xl text-gray-600">Get in touch with our team</p>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 class="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
                <div class="space-y-4">
                  <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <span class="text-gray-600">support@base64-encoder.com</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
                    </svg>
                    <span class="text-gray-600">Available 24/7</span>
                  </div>
                </div>

                <div class="mt-8">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
                  <div class="space-y-3">
                    <details class="group">
                      <summary class="flex cursor-pointer items-center justify-between text-gray-700 hover:text-gray-900">
                        <span class="font-medium">Is my data secure?</span>
                        <svg class="h-5 w-5 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </summary>
                      <p class="mt-2 text-gray-600">Yes, all processing happens in your browser. No data is sent to our servers.</p>
                    </details>
                    <details class="group">
                      <summary class="flex cursor-pointer items-center justify-between text-gray-700 hover:text-gray-900">
                        <span class="font-medium">Is there a file size limit?</span>
                        <svg class="h-5 w-5 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </summary>
                      <p class="mt-2 text-gray-600">The limit depends on your browser's memory. Most modern browsers can handle large files efficiently.</p>
                    </details>
                  </div>
                </div>
              </div>

              <div>
                <h2 class="text-2xl font-semibold text-gray-900 mb-6">Send a Message</h2>
                <form class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"></textarea>
                  </div>
                  <button type="submit" class="w-full bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Privacy Policy Page -->
      <div v-if="currentPage === 'privacy'" class="py-16">
        <div class="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p class="text-xl text-gray-600">How we protect and handle your data</p>
            <p class="text-sm text-gray-500 mt-2">Last updated: August 13, 2025</p>
          </div>

          <div class="prose prose-lg max-w-none">
            <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-8 space-y-8">
              
              <section>
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">Overview</h2>
                <p class="text-gray-600 mb-4">
                  At Base64-Encoder.com, we take your privacy seriously. This Privacy Policy explains how we collect, 
                  use, and protect your information when you use our Base64 encoding and decoding service.
                </p>
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p class="text-green-800 font-medium">
                    🔒 Key Point: All Base64 encoding and decoding operations are performed entirely in your browser. 
                    Your data never leaves your device.
                  </p>
                </div>
              </section>

              <section>
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">Information We Don't Collect</h2>
                <ul class="text-gray-600 space-y-2 list-disc list-inside">
                  <li>We do not collect, store, or process any text you encode or decode</li>
                  <li>We do not track your usage patterns or conversion history</li>
                  <li>We do not require account registration or personal information</li>
                  <li>We do not use cookies for tracking purposes</li>
                </ul>
              </section>

              <section>
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">Information We May Collect</h2>
                <div class="space-y-4">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Technical Information</h3>
                    <ul class="text-gray-600 space-y-1 list-disc list-inside ml-4">
                      <li>IP address for security and abuse prevention</li>
                      <li>Browser type and version for compatibility</li>
                      <li>Basic usage analytics (page views, without personal identification)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Contact Information</h3>
                    <ul class="text-gray-600 space-y-1 list-disc list-inside ml-4">
                      <li>Email address (only if you contact us voluntarily)</li>
                      <li>Name (only if provided in contact forms)</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">How We Use Information</h2>
                <ul class="text-gray-600 space-y-2 list-disc list-inside">
                  <li>To provide and maintain our service</li>
                  <li>To improve user experience and fix technical issues</li>
                  <li>To respond to support requests and inquiries</li>
                  <li>To prevent abuse and ensure service security</li>
                </ul>
              </section>

              <section>
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
                <p class="text-gray-600 mb-4">
                  We implement appropriate security measures to protect any information we collect:
                </p>
                <ul class="text-gray-600 space-y-2 list-disc list-inside">
                  <li>HTTPS encryption for all communications</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited data retention policies</li>
                  <li>No storage of sensitive conversion data</li>
                </ul>
              </section>

              <section>
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
                <p class="text-gray-600 mb-4">
                  We may use third-party services for analytics and performance monitoring. 
                  These services have their own privacy policies:
                </p>
                <ul class="text-gray-600 space-y-2 list-disc list-inside">
                  <li>Google Analytics (for anonymous usage statistics)</li>
                  <li>Cloudflare (for CDN and security)</li>
                </ul>
              </section>

              <section>
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
                <p class="text-gray-600 mb-4">You have the right to:</p>
                <ul class="text-gray-600 space-y-2 list-disc list-inside">
                  <li>Request information about any data we have collected</li>
                  <li>Request deletion of your data</li>
                  <li>Opt out of analytics tracking</li>
                  <li>Contact us with privacy concerns</li>
                </ul>
              </section>

              <section>
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
                <p class="text-gray-600">
                  If you have any questions about this Privacy Policy, please contact us at:
                  <a href="mailto:privacy@base64-encoder.com" class="text-blue-600 hover:text-blue-800 underline">
                    privacy@base64-encoder.com
                  </a>
                </p>
              </section>

            </div>
          </div>
        </div>
      </div>

      <!-- Terms of Service Page -->
      <div v-if="currentPage === 'terms'" class="py-16">
        <div class="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p class="text-xl text-gray-600">Terms and conditions for using our service</p>
            <p class="text-sm text-gray-500 mt-2">Last updated: August 13, 2025</p>
          </div>

          <div class="prose prose-lg max-w-none">
            <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-8 space-y-8">
              
              <section>
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
                <p class="text-gray-600">
                  By accessing and using Base64-Encoder.com, you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to these terms, please do not use our service.
                </p>
              </section>

              <section>
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">Service Description</h2>
                <p class="text-gray-600 mb-4">
                  Base64-Encoder.com provides free online Base64 encoding and decoding services. Our service includes:
                </p>
                <ul class="text-gray-600 space-y-2 list-disc list-inside">
                  <li>Web-based Base64 encoding and decoding tools</li>
                  <li>API endpoints for programmatic access</li>
                  <li>Documentation and support resources</li>
                </ul>
              </section>

              <section>
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">Acceptable Use</h2>
                <p class="text-gray-600 mb-4">You agree to use our service only for lawful purposes. You may not:</p>
                <ul class="text-gray-600 space-y-2 list-disc list-inside">
                  <li>Use the service for any illegal or unauthorized purpose</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use automated systems to abuse or overload our service</li>
                  <li>Encode or decode content that violates applicable laws</li>
                  <li>Interfere with other users' access to the service</li>
                </ul>
              </section>

              <section>
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">API Usage</h2>
                <div class="space-y-4">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Rate Limits</h3>
                    <p class="text-gray-600">
                      API usage is subject to rate limits to ensure fair use and service availability. 
                      Exceeding these limits may result in temporary access restrictions.
                    </p>
                  </div>
                  
                  <div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Commercial Use</h3>
                    <p class="text-gray-600">
                      Commercial use of our API is permitted under fair use guidelines. 
                      High-volume commercial users should contact us for enterprise solutions.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">Service Availability</h2>
                <p class="text-gray-600 mb-4">
                  We strive to maintain high service availability, but we do not guarantee uninterrupted access. 
                  We reserve the right to:
                </p>
                <ul class="text-gray-600 space-y-2 list-disc list-inside">
                  <li>Modify or discontinue the service with reasonable notice</li>
                  <li>Perform scheduled maintenance and updates</li>
                  <li>Restrict access to prevent abuse or technical issues</li>
                </ul>
              </section>

              <section>
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
                <p class="text-gray-600 mb-4">
                  The Base64-Encoder.com website, its design, and underlying code are protected by intellectual property rights. 
                  You may not:
                </p>
                <ul class="text-gray-600 space-y-2 list-disc list-inside">
                  <li>Copy, reproduce, or distribute our website design</li>
                  <li>Reverse engineer our service</li>
                  <li>Use our branding or trademarks without permission</li>
                </ul>
              </section>

              <section>
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">Disclaimer of Warranties</h2>
                <p class="text-gray-600">
                  Our service is provided "as is" without warranties of any kind. We disclaim all warranties, 
                  express or implied, including but not limited to the warranties of merchantability, 
                  fitness for a particular purpose, and non-infringement.
                </p>
              </section>

              <section>
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
                <p class="text-gray-600">
                  In no event shall Base64-Encoder.com be liable for any indirect, incidental, special, 
                  consequential, or punitive damages, including without limitation, loss of profits, 
                  data, or other intangible losses.
                </p>
              </section>

              <section>
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
                <p class="text-gray-600">
                  We reserve the right to modify these terms at any time. Changes will be posted on this page 
                  with an updated revision date. Your continued use of the service constitutes acceptance of the modified terms.
                </p>
              </section>

              <section>
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                <p class="text-gray-600">
                  For questions about these Terms of Service, please contact us at:
                  <a href="mailto:legal@base64-encoder.com" class="text-blue-600 hover:text-blue-800 underline">
                    legal@base64-encoder.com
                  </a>
                </p>
              </section>

            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Company Info -->
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center space-x-2 mb-4">
              <div class="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">B64</span>
              </div>
              <span class="text-xl font-bold text-gray-900">Base64-Encoder</span>
            </div>
            <p class="text-gray-600 mb-4 max-w-md">
              Professional Base64 encoding and decoding tool. Fast, secure, and reliable conversion 
              for developers and IT professionals at Base64-Encoder.com.
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li><button @click="navigateTo('home')" class="text-gray-600 hover:text-gray-900 transition-colors duration-200">Home</button></li>
              <li><button @click="navigateTo('tools')" class="text-gray-600 hover:text-gray-900 transition-colors duration-200">Tools</button></li>
              <li><button @click="navigateTo('about')" class="text-gray-600 hover:text-gray-900 transition-colors duration-200">About</button></li>
              <li><button @click="navigateTo('contact')" class="text-gray-600 hover:text-gray-900 transition-colors duration-200">Contact</button></li>
            </ul>
          </div>

          <!-- Resources -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Resources</h3>
            <ul class="space-y-2">
              <li><button @click="navigateTo('faq')" class="text-gray-600 hover:text-gray-900 transition-colors duration-200">FAQ</button></li>
              <li><button @click="navigateTo('privacy')" class="text-gray-600 hover:text-gray-900 transition-colors duration-200">Privacy Policy</button></li>
              <li><button @click="navigateTo('terms')" class="text-gray-600 hover:text-gray-900 transition-colors duration-200">Terms of Service</button></li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-200 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p class="text-gray-500 text-sm">
            © 2025 Base64-Encoder.com. All rights reserved.
          </p>
          <div class="flex space-x-6 mt-4 sm:mt-0">
            <button @click="navigateTo('privacy')" class="text-gray-500 hover:text-gray-900 text-sm transition-colors duration-200">Privacy</button>
            <button @click="navigateTo('terms')" class="text-gray-500 hover:text-gray-900 text-sm transition-colors duration-200">Terms</button>
            <a href="#" class="text-gray-500 hover:text-gray-900 text-sm transition-colors duration-200">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Custom styles for full screen coverage and desktop optimization */
* {
  box-sizing: border-box;
}

/* Mobile menu animation */
.mobile-menu-container {
  position: relative;
}

/* Full viewport height for main container */
.min-h-screen {
  min-height: 100vh;
}

/* Desktop-specific optimizations */
@media (min-width: 1024px) {
  /* Larger containers for desktop */
  .max-w-7xl {
    max-width: 90rem;
  }
  
  /* Better spacing for desktop */
  .desktop-spacing {
    padding: 2rem 0;
  }
  
  /* Enhanced hover effects for desktop */
  button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  /* Smooth transitions */
  * {
    transition: all 0.2s ease-in-out;
  }
}

/* Code block styling */
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* FAQ accordion styling */
details[open] summary {
  margin-bottom: 1rem;
}

/* Improved focus states for accessibility */
button:focus,
a:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Better print styles */
@media print {
  .no-print {
    display: none;
  }
}
</style>

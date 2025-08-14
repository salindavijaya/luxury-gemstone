<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto"
        role="dialog"
        :aria-labelledby="titleId"
        :aria-describedby="descriptionId"
        aria-modal="true"
        @keydown.esc="handleEscapeKey"
      >
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          @click="handleBackdropClick"
          aria-hidden="true"
        ></div>

        <!-- Modal Container -->
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              v-if="modelValue"
              :class="modalClasses"
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6"
              @click.stop
            >
              <!-- Close Button -->
              <button
                v-if="closable"
                @click="close"
                class="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors z-10"
                :aria-label="$t?.('common.close') || 'Close'"
              >
                <XMarkIcon class="h-6 w-6" />
              </button>

              <!-- Header -->
              <div v-if="$slots.header || title" class="mb-4">
                <slot name="header">
                  <h3 
                    :id="titleId" 
                    :class="[
                      'text-lg font-semibold leading-6 text-slate-900',
                      closable ? 'pr-8' : ''
                    ]"
                  >
                    {{ title }}
                  </h3>
                </slot>
              </div>

              <!-- Body -->
              <div :id="descriptionId" class="modal-body">
                <slot />
              </div>

              <!-- Footer -->
              <div v-if="$slots.footer || showDefaultFooter" class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <slot name="footer">
                  <template v-if="showDefaultFooter">
                    <button
                      @click="close"
                      type="button"
                      class="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:w-auto"
                    >
                      {{ cancelText }}
                    </button>
                    <button
                      v-if="confirmText"
                      @click="confirm"
                      type="button"
                      :class="[
                        'inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto',
                        variant === 'danger' 
                          ? 'bg-red-600 hover:bg-red-500' 
                          : 'bg-emerald-600 hover:bg-emerald-500'
                      ]"
                    >
                      {{ confirmText }}
                    </button>
                  </template>
                </slot>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted, onUnmounted } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

// Types
interface Props {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  variant?: 'default' | 'danger' | 'success' | 'warning'
  closable?: boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  persistent?: boolean
  confirmText?: string
  cancelText?: string
  showDefaultFooter?: boolean
  maxHeight?: string
}

// Props with defaults
const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'default',
  closable: true,
  closeOnBackdrop: true,
  closeOnEscape: true,
  persistent: false,
  cancelText: 'Cancel',
  showDefaultFooter: false
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
  confirm: []
  'after-enter': []
  'after-leave': []
}>()

// Reactive state
const titleId = ref(`modal-title-${Math.random().toString(36).substr(2, 9)}`)
const descriptionId = ref(`modal-description-${Math.random().toString(36).substr(2, 9)}`)
const previousFocus = ref<HTMLElement | null>(null)

// Computed properties
const modalClasses = computed(() => {
  const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
    full: 'sm:max-w-full sm:mx-4'
  }
  
  const heightClass = props.maxHeight ? '' : 'max-h-[90vh] overflow-y-auto'
  
  return `${sizeClasses[props.size]} ${heightClass}`
})

// Methods
const close = () => {
  if (props.persistent) return
  emit('update:modelValue', false)
  emit('close')
}

const confirm = () => {
  emit('confirm')
  if (!props.persistent) {
    emit('update:modelValue', false)
  }
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    close()
  }
}

const handleEscapeKey = () => {
  if (props.closeOnEscape) {
    close()
  }
}

const trapFocus = (e: KeyboardEvent) => {
  if (!props.modelValue) return
  
  const focusableElements = document.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const focusableArray = Array.from(focusableElements) as HTMLElement[]
  const firstElement = focusableArray[0]
  const lastElement = focusableArray[focusableArray.length - 1]
  
  if (e.key === 'Tab') {
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement?.focus()
        e.preventDefault()
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement?.focus()
        e.preventDefault()
      }
    }
  }
}

const handleBodyScroll = (lock: boolean) => {
  if (lock) {
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = getScrollbarWidth() + 'px'
  } else {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  }
}

const getScrollbarWidth = () => {
  const scrollDiv = document.createElement('div')
  scrollDiv.style.cssText = 'width: 100px; height: 100px; overflow: scroll; position: absolute; top: -9999px;'
  document.body.appendChild(scrollDiv)
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
  document.body.removeChild(scrollDiv)
  return scrollbarWidth
}

// Watchers
watch(() => props.modelValue, async (newValue) => {
  if (newValue) {
    previousFocus.value = document.activeElement as HTMLElement
    handleBodyScroll(true)
    document.addEventListener('keydown', trapFocus)
    
    // Focus first focusable element after transition
    await nextTick()
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstFocusable = focusableElements[0] as HTMLElement
    firstFocusable?.focus()
    
    emit('after-enter')
  } else {
    handleBodyScroll(false)
    document.removeEventListener('keydown', trapFocus)
    
    // Restore previous focus
    if (previousFocus.value) {
      previousFocus.value.focus()
    }
    
    emit('after-leave')
  }
})

// Lifecycle
onUnmounted(() => {
  handleBodyScroll(false)
  document.removeEventListener('keydown', trapFocus)
})
</script>

<style scoped>
/* Ensure modal content doesn't scroll behind backdrop on mobile */
.modal-body {
  max-height: inherit;
  overflow-y: auto;
}

/* Custom scrollbar for modal content */
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .modal-body {
    max-height: calc(90vh - 120px);
  }
}
</style>
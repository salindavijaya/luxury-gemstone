<template>
    <div class="w-full max-w-md mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-slate-800 mb-2">Create Account</h2>
        <p class="text-slate-600">Join us to discover amazing gemstones</p>
      </div>
  
      <!-- Registration Form -->
      <form @submit.prevent="handleSubmit" novalidate class="space-y-6">
        <!-- Name Fields Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- First Name -->
          <div class="relative">
            <input
              :id="firstNameFieldId"
              v-model="formData.firstName"
              type="text"
              autocomplete="given-name"
              class="peer w-full px-4 pt-6 pb-2 border rounded-lg text-slate-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              :class="{
                'border-red-300 focus:ring-red-500': hasFieldError('firstName'),
                'border-slate-300': !hasFieldError('firstName')
              }"
              placeholder="First Name"
              @blur="touchField('firstName')"
              @focus="clearFieldError"
              :aria-describedby="hasFieldError('firstName') ? `${firstNameFieldId}-error` : undefined"
              :aria-invalid="hasFieldError('firstName')"
            />
            <label
              :for="firstNameFieldId"
              class="absolute left-4 top-2 text-xs text-slate-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-emerald-600"
            >
              First Name
            </label>
            <div
              v-if="hasFieldError('firstName')"
              :id="`${firstNameFieldId}-error`"
              class="mt-1 text-sm text-red-600"
              role="alert"
            >
              {{ getFieldError('firstName') }}
            </div>
          </div>
  
          <!-- Last Name -->
          <div class="relative">
            <input
              :id="lastNameFieldId"
              v-model="formData.lastName"
              type="text"
              autocomplete="family-name"
              class="peer w-full px-4 pt-6 pb-2 border rounded-lg text-slate-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              :class="{
                'border-red-300 focus:ring-red-500': hasFieldError('lastName'),
                'border-slate-300': !hasFieldError('lastName')
              }"
              placeholder="Last Name"
              @blur="touchField('lastName')"
              @focus="clearFieldError"
              :aria-describedby="hasFieldError('lastName') ? `${lastNameFieldId}-error` : undefined"
              :aria-invalid="hasFieldError('lastName')"
            />
            <label
              :for="lastNameFieldId"
              class="absolute left-4 top-2 text-xs text-slate-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-emerald-600"
            >
              Last Name
            </label>
            <div
              v-if="hasFieldError('lastName')"
              :id="`${lastNameFieldId}-error`"
              class="mt-1 text-sm text-red-600"
              role="alert"
            >
              {{ getFieldError('lastName') }}
            </div>
          </div>
        </div>
  
        <!-- Email Field -->
        <div class="relative">
          <input
            :id="emailFieldId"
            v-model="formData.email"
            type="email"
            autocomplete="email"
            class="peer w-full px-4 pt-6 pb-2 border rounded-lg text-slate-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            :class="{
              'border-red-300 focus:ring-red-500': hasFieldError('email'),
              'border-slate-300': !hasFieldError('email')
            }"
            placeholder="Email address"
            @blur="touchField('email')"
            @focus="clearFieldError"
            :aria-describedby="hasFieldError('email') ? `${emailFieldId}-error` : undefined"
            :aria-invalid="hasFieldError('email')"
          />
          <label
            :for="emailFieldId"
            class="absolute left-4 top-2 text-xs text-slate-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-emerald-600"
          >
            Email Address
          </label>
          <div
            v-if="hasFieldError('email')"
            :id="`${emailFieldId}-error`"
            class="mt-1 text-sm text-red-600"
            role="alert"
          >
            {{ getFieldError('email') }}
          </div>
        </div>
  
        <!-- Phone Field (Optional) -->
        <div class="relative">
          <input
            :id="phoneFieldId"
            v-model="formData.phone"
            type="tel"
            autocomplete="tel"
            class="peer w-full px-4 pt-6 pb-2 border rounded-lg text-slate-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            :class="{
              'border-red-300 focus:ring-red-500': hasFieldError('phone'),
              'border-slate-300': !hasFieldError('phone')
            }"
            placeholder="Phone number"
            @blur="touchField('phone')"
            @focus="clearFieldError"
            :aria-describedby="hasFieldError('phone') ? `${phoneFieldId}-error` : undefined"
            :aria-invalid="hasFieldError('phone')"
          />
          <label
            :for="phoneFieldId"
            class="absolute left-4 top-2 text-xs text-slate-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-emerald-600"
          >
            Phone Number (Optional)
          </label>
          <div
            v-if="hasFieldError('phone')"
            :id="`${phoneFieldId}-error`"
            class="mt-1 text-sm text-red-600"
            role="alert"
          >
            {{ getFieldError('phone') }}
          </div>
        </div>
  
        <!-- Password Field -->
        <div class="relative">
          <input
            :id="passwordFieldId"
            v-model="formData.password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            class="peer w-full px-4 pt-6 pb-2 pr-12 border rounded-lg text-slate-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            :class="{
              'border-red-300 focus:ring-red-500': hasFieldError('password'),
              'border-slate-300': !hasFieldError('password')
            }"
            placeholder="Password"
            @blur="touchField('password')"
            @focus="clearFieldError"
            :aria-describedby="hasFieldError('password') ? `${passwordFieldId}-error` : undefined"
            :aria-invalid="hasFieldError('password')"
          />
          <label
            :for="passwordFieldId"
            class="absolute left-4 top-2 text-xs text-slate-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-emerald-600"
          >
            Password
          </label>
          <!-- Password Toggle -->
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus:text-slate-600 transition-colors duration-200"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
          >
            <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l-.186-.186M19.5 19.5l-15-15"></path>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
          </button>
          <div
            v-if="hasFieldError('password')"
            :id="`${passwordFieldId}-error`"
            class="mt-1 text-sm text-red-600"
            role="alert"
          >
            {{ getFieldError('password') }}
          </div>
        </div>
  
        <!-- Password Strength Indicator -->
        <div v-if="formData.password" class="space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-600">Password Strength:</span>
            <span :class="passwordStrength.color.replace('bg-', 'text-')" class="font-medium">
              {{ passwordStrength.label }}
            </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-
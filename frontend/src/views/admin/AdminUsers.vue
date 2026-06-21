<!-- frontend/src/views/admin/AdminUsers.vue -->
<template>
    <div>
        <!-- Header & Actions -->
        <div class="flex flex-col gap-4 mb-3 px-8 py-4 rounded-b-lg bg-white lg:flex-row lg:items-center lg:justify-between">
            <div>
                <h2 class="text-2xl font-bold text-slate-800">{{ t('adminUsers.title') }}</h2>
                <p class="text-sm text-slate-500">Manage user accounts, roles, verification statuses, and system administrator profiles.</p>
            </div>
            <div class="flex items-center gap-2">
                <button @click="showCreateModal = true"
                    class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#24a3b5] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#1d8b9a] shadow-sm shadow-[#24a3b5]/10">
                    <UserPlus class="h-4 w-4" />
                    <span>{{ t('adminUsers.addNewUser') }}</span>
                </button>
            </div>
        </div>

        <!-- User Type Toggle Tabs -->
        <div class="mb-4 bg-white px-8 py-2 rounded-b-lg border-b border-slate-100">
            <div class="bg-slate-100/80 p-1.5 rounded-xl flex gap-1 max-w-md">
                <button @click="activeTab = 'admins'" :class="[
                    activeTab === 'admins' ? 'bg-white text-slate-800 shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-700 font-medium',
                    'flex-1 py-2 px-3 text-center rounded-lg text-sm transition-all duration-200 focus:outline-none'
                ]">
                    {{ t('adminUsers.tabs.admins') }}
                </button>
                <button @click="activeTab = 'users'" :class="[
                    activeTab === 'users' ? 'bg-white text-slate-800 shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-700 font-medium',
                    'flex-1 py-2 px-3 text-center rounded-lg text-sm transition-all duration-200 focus:outline-none'
                ]">
                    {{ t('adminUsers.tabs.users') }}
                </button>
                <button @click="activeTab = 'sellers'" :class="[
                    activeTab === 'sellers' ? 'bg-white text-slate-800 shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-700 font-medium',
                    'flex-1 py-2 px-3 text-center rounded-lg text-sm transition-all duration-200 focus:outline-none'
                ]">
                    {{ t('adminUsers.tabs.sellers') }}
                </button>
            </div>
        </div>

        <!-- Toggleable Filters -->
        <div class="mb-4 rounded-xl bg-white p-5 border border-slate-100 shadow-sm">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 items-end">
                <!-- Search Input -->
                <div class="col-span-1">
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {{ t('adminSellers.filters.search') }}
                    </label>
                    <input 
                        type="text" 
                        v-model="filters.search" 
                        :placeholder="t('adminSellers.filters.searchPlaceholder')"
                        class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 transition focus:border-[#24a3b5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10"
                        @input="resetPagination"
                    />
                </div>

                <!-- Status Filter -->
                <div class="col-span-1">
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {{ t('adminSellers.filters.status') }}
                    </label>
                    <div class="relative">
                        <select 
                            v-model="filters.status"
                            class="appearance-none w-full rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 py-2 text-sm text-slate-700 transition focus:border-[#24a3b5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10"
                            @change="resetPagination"
                        >
                            <option value="">{{ t('adminSellers.filters.allStatus') }}</option>
                            <option value="active">{{ t('adminUsers.status.active') }}</option>
                            <option value="blocked">{{ t('adminUsers.status.blocked') }}</option>
                        </select>
                        <div class="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="h-4 w-4 text-slate-400" />
                        </div>
                    </div>
                </div>

                <!-- Role Filter (Admins tab only) -->
                <div v-if="activeTab === 'admins'" class="col-span-1">
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {{ t('adminUsers.form.role') }}
                    </label>
                    <div class="relative">
                        <select 
                            v-model="filters.role"
                            class="appearance-none w-full rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 py-2 text-sm text-slate-700 transition focus:border-[#24a3b5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10"
                            @change="resetPagination"
                        >
                            <option value="">All Roles</option>
                            <option value="Admin">{{ t('adminUsers.roles.admin') }}</option>
                            <option value="SuperAdmin">Super Admin</option>
                            <option value="Moderator">{{ t('adminUsers.roles.moderator') }}</option>
                        </select>
                        <div class="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="h-4 w-4 text-slate-400" />
                        </div>
                    </div>
                </div>

                <!-- Verification Status Filter (Sellers tab only) -->
                <div v-if="activeTab === 'sellers'" class="col-span-1">
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Verification Status
                    </label>
                    <div class="relative">
                        <select 
                            v-model="filters.verificationStatus"
                            class="appearance-none w-full rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 py-2 text-sm text-slate-700 transition focus:border-[#24a3b5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10"
                            @change="resetPagination"
                        >
                            <option value="">{{ t('adminSellers.filters.allStatus') }}</option>
                            <option value="approved">{{ t('adminSellers.statusOptions.approved') }}</option>
                            <option value="pending">{{ t('adminSellers.statusOptions.underReview') }}</option>
                            <option value="rejected">{{ t('adminSellers.statusOptions.rejected') }}</option>
                            <option value="not_submitted">{{ t('adminSellers.statusOptions.notSubmitted') }}</option>
                        </select>
                        <div class="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="h-4 w-4 text-slate-400" />
                        </div>
                    </div>
                </div>

                <!-- Clear Filters Button -->
                <div class="col-span-1">
                    <button 
                        v-if="filters.search || filters.status || filters.role || filters.verificationStatus"
                        type="button"
                        class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
                        @click="clearFilters"
                    >
                        {{ t('adminProducts.filters.clear') }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Users Table Card -->
        <div class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-[1100px] w-full divide-y divide-slate-100 table-fixed">
                    <thead class="sticky top-0 z-10 bg-slate-50 shadow-sm">
                        <tr>
                            <th class="w-[20%] px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">{{ t('adminUsers.table.user') }}</th>
                            <th class="w-[22%] px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">{{ t('adminUsers.table.email') }}</th>
                            <template v-if="activeTab === 'sellers'">
                                <th class="w-[16%] px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">{{ t('adminUsers.table.storeName') }}</th>
                                <th class="w-[12%] px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">{{ t('adminUsers.table.verification') }}</th>
                            </template>
                            <template v-else>
                                <th class="w-[12%] px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">{{ t('adminUsers.table.role') }}</th>
                            </template>
                            <th class="w-[18%] px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">{{ t('adminUsers.table.lastLogin') }}</th>
                            <th class="w-[10%] px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">{{ t('adminUsers.table.twoFactor') }}</th>
                            <th class="w-[12%] px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">{{ t('adminUsers.table.status') }}</th>
                            <th class="w-[10%] px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">{{ t('adminUsers.table.actions') }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
                        <tr v-for="user in paginatedUsers" :key="user._id" class="hover:bg-slate-50/50 transition-colors">
                            <!-- User -->
                            <td class="px-6 py-4 align-middle">
                                <div class="flex items-center gap-3">
                                    <div class="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 uppercase border border-slate-200 shrink-0 shadow-sm">
                                        {{ getInitials(user.username, user.email) }}
                                    </div>
                                    <div class="text-sm font-semibold text-slate-800 break-words leading-tight">{{ user.username }}</div>
                                </div>
                            </td>

                            <!-- Email -->
                            <td class="px-6 py-4 align-middle">
                                <div class="text-sm text-slate-600 break-all leading-tight font-medium">{{ user.email }}</div>
                            </td>

                            <!-- Store / Verification / Role -->
                            <template v-if="activeTab === 'sellers'">
                                <td class="px-6 py-4 align-middle">
                                    <div class="text-sm font-semibold text-slate-800 break-words leading-tight">{{ user.storeName }}</div>
                                </td>
                                <td class="px-6 py-4 align-middle">
                                    <span :class="['inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border whitespace-nowrap', getVerificationClass(user.verificationStatus)]">
                                        <component :is="getVerificationIcon(user.verificationStatus)" class="h-3.5 w-3.5" />
                                        {{ user.verificationStatus || t('adminUsers.status.notVerified') }}
                                    </span>
                                </td>
                            </template>
                            <template v-else>
                                <td class="px-6 py-4 align-middle">
                                    <span v-if="user.role" class="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                                        {{ user.role }}
                                    </span>
                                    <span v-else class="text-xs text-slate-400 font-medium">—</span>
                                </td>
                            </template>

                            <!-- Last Login -->
                            <td class="px-6 py-4 align-middle">
                                <div v-if="user.lastLogin" class="flex items-start gap-2 text-slate-600 text-sm font-medium">
                                    <CalendarIcon class="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                                    <div class="flex flex-col">
                                        <span class="text-slate-700 leading-tight">{{ formatJustDate(user.lastLogin) }}</span>
                                        <span class="text-slate-400 text-xs mt-0.5 leading-tight">{{ formatJustTime(user.lastLogin) }}</span>
                                    </div>
                                </div>
                                <span v-else class="inline-flex items-center gap-1 text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-50 border border-slate-100 rounded px-2 py-0.5">
                                    {{ t('adminUsers.status.never') }}
                                </span>
                            </td>

                            <!-- Two Factor -->
                            <td class="px-6 py-4 align-middle">
                                <span :class="['inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border whitespace-nowrap', get2FAClass(user.twoFactorEnabled)]">
                                    <component :is="get2FAIcon(user.twoFactorEnabled)" class="h-3.5 w-3.5" />
                                    {{ user.twoFactorEnabled ? t('adminUsers.status.enabled') : t('adminUsers.status.disabled') }}
                                </span>
                            </td>

                            <!-- Status -->
                            <td class="px-6 py-4 align-middle">
                                <span :class="['inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border whitespace-nowrap', getStatusClass(user)]">
                                    <component :is="getStatusIcon(user)" class="h-3.5 w-3.5" />
                                    {{ getStatusText(user) }}
                                </span>
                            </td>

                            <!-- Actions -->
                            <td class="px-6 py-4 align-middle text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <button @click="editUser(user)" class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                                        {{ t('adminUsers.actions.edit') }}
                                    </button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger as-child>
                                            <button class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors shadow-sm focus:outline-none">
                                                <MoreHorizontal class="h-4 w-4" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" class="w-52">
                                            <DropdownMenuLabel class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">User Actions</DropdownMenuLabel>
                                            <DropdownMenuItem @click="resetPassword(user._id)" class="flex items-center gap-2 cursor-pointer py-2 text-sm text-slate-700">
                                                <span>{{ t('adminUsers.actions.resetPassword') }}</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem @click="toggle2FA(user._id)" class="flex items-center gap-2 cursor-pointer py-2 text-sm text-slate-700">
                                                <span>{{ user.twoFactorEnabled ? t('adminUsers.actions.disable') : t('adminUsers.actions.enable') }} 2FA</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem @click="toggleBlockStatus(user._id)" class="flex items-center gap-2 cursor-pointer py-2 text-sm text-slate-700">
                                                <span>{{ user.isBlocked ? t('adminUsers.actions.unblockUser') : t('adminUsers.actions.blockUser') }}</span>
                                            </DropdownMenuItem>
                                            <template v-if="activeTab === 'sellers'">
                                                <DropdownMenuItem @click="toggleVerification(user._id)" class="flex items-center gap-2 cursor-pointer py-2 text-sm text-slate-700">
                                                    <span>{{ user.verificationStatus === 'approved' ? t('adminUsers.actions.revokeVerification') : t('adminUsers.actions.approveVerification') }}</span>
                                                </DropdownMenuItem>
                                            </template>
                                            <DropdownMenuItem @click="viewActivityLog(user._id)" class="flex items-center gap-2 cursor-pointer py-2 text-sm text-slate-700">
                                                <span>{{ t('adminUsers.actions.viewActivityLog') }}</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem @click="managePermissions(user._id)" class="flex items-center gap-2 cursor-pointer py-2 text-sm text-slate-700">
                                                <span>{{ t('adminUsers.actions.managePermissions') }}</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem @click="forceLogout(user._id)" class="flex items-center gap-2 cursor-pointer py-2 text-sm text-slate-700">
                                                <span>{{ t('adminUsers.actions.forceLogout') }}</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem @click="deleteUser(user._id)" class="flex items-center gap-2 cursor-pointer py-2 text-sm text-rose-600 font-semibold hover:bg-rose-50">
                                                <span>{{ t('adminUsers.actions.delete') }}</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="flex items-center justify-between border-t border-slate-100 px-6 py-4">
                <div class="flex-1 flex justify-between sm:hidden">
                    <button @click="prevPage" :disabled="currentPage === 1"
                        class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        {{ t('adminSellers.pagination.previous') }}
                    </button>
                    <button @click="nextPage" :disabled="currentPage === totalPages"
                        class="ml-3 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        {{ t('adminSellers.pagination.next') }}
                    </button>
                </div>
                <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p class="text-sm text-slate-500 font-medium">
                            {{ t('adminSellers.pagination.showing') }}
                            <span class="font-bold text-slate-700">{{ startItem }}</span>
                            {{ t('adminSellers.pagination.to') }}
                            <span class="font-bold text-slate-700">{{ endItem }}</span>
                            {{ t('adminSellers.pagination.of') }}
                            <span class="font-bold text-slate-700">{{ totalItems }}</span>
                            {{ t('adminSellers.pagination.results') }}
                        </p>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <button @click="prevPage" :disabled="currentPage === 1"
                                class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                {{ t('adminSellers.pagination.previous') }}
                            </button>
                            <button @click="nextPage" :disabled="currentPage === totalPages"
                                class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                {{ t('adminSellers.pagination.next') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <div v-if="showCreateModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-xl border border-slate-100 shadow-xl w-full max-w-md overflow-hidden transform transition-all duration-200">
                <div class="bg-slate-900 px-6 py-4 text-white">
                    <h3 class="text-lg font-bold">
                        {{ selectedUser ? t('adminUsers.editUser') : t('adminUsers.createNewUser') }}
                    </h3>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="p-6 space-y-4">
                        <div>
                            <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminUsers.form.username') }}</label>
                            <input v-model="formData.username" type="text"
                                class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 transition focus:border-[#24a3b5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10" required />
                        </div>
                        <div>
                            <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminUsers.form.email') }}</label>
                            <input v-model="formData.email" type="email"
                                class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 transition focus:border-[#24a3b5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10" required />
                        </div>
                        <div>
                            <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminUsers.form.userType') }}</label>
                            <div class="relative">
                                <select v-model="activeTab"
                                    class="appearance-none w-full rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 py-2 text-sm text-slate-700 transition focus:border-[#24a3b5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10"
                                    @change="updateFormDataRole">
                                    <option value="admins">{{ t('adminUsers.tabs.admins') }}</option>
                                    <option value="users">{{ t('adminUsers.tabs.users') }}</option>
                                    <option value="sellers">{{ t('adminUsers.tabs.sellers') }}</option>
                                </select>
                                <div class="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <ChevronDown class="h-4 w-4 text-slate-400" />
                                </div>
                            </div>
                        </div>
                        <template v-if="activeTab === 'admins'">
                            <div>
                                <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminUsers.form.role') }}</label>
                                <div class="relative">
                                    <select v-model="formData.role"
                                        class="appearance-none w-full rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 py-2 text-sm text-slate-700 transition focus:border-[#24a3b5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10">
                                        <option value="User">{{ t('adminUsers.roles.user') }}</option>
                                        <option value="Admin">{{ t('adminUsers.roles.admin') }}</option>
                                        <option value="Moderator">{{ t('adminUsers.roles.moderator') }}</option>
                                    </select>
                                    <div class="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <ChevronDown class="h-4 w-4 text-slate-400" />
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-if="activeTab === 'sellers'">
                            <div>
                                <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminUsers.form.storeName') }}</label>
                                <input v-model="formData.storeName" type="text"
                                    class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 transition focus:border-[#24a3b5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10"
                                    required />
                            </div>
                            <div>
                                <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminUsers.form.storeDescription') }}</label>
                                <textarea v-model="formData.storeDescription"
                                    class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 transition focus:border-[#24a3b5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10"
                                    rows="3"></textarea>
                            </div>
                        </template>
                        <div v-if="!selectedUser">
                            <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminUsers.form.password') }}</label>
                            <input v-model="formData.password" type="password"
                                class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 transition focus:border-[#24a3b5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10" required />
                        </div>
                    </div>
                    <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                        <button type="button" @click="showCreateModal = false"
                            class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                            {{ t('adminUsers.form.cancel') }}
                        </button>
                        <button type="submit" class="inline-flex items-center justify-center rounded-lg bg-[#24a3b5] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#1d8b9a] shadow-sm shadow-[#24a3b5]/10">
                            {{ selectedUser ? t('adminUsers.form.update') : t('adminUsers.form.create') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Activity Log Modal -->
        <div v-if="showActivityModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-xl border border-slate-100 shadow-xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col transform transition-all duration-200">
                <div class="bg-slate-900 px-6 py-4 text-white flex justify-between items-center shrink-0">
                    <h3 class="text-lg font-bold">{{ t('adminUsers.activityLog.title') }}</h3>
                    <button @click="showActivityModal = false" class="text-white/70 hover:text-white transition-colors focus:outline-none">
                        <XIcon class="h-5 w-5" />
                    </button>
                </div>
                <div class="p-6 overflow-y-auto space-y-4 flex-1">
                    <div v-for="activity in activityLog" :key="activity.id" class="rounded-lg border border-slate-100 bg-slate-50/50 p-4 space-y-2">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-xs text-slate-400 font-semibold uppercase tracking-wider">{{ activity.formattedDate }}</p>
                            </div>
                            <span class="inline-flex items-center rounded-full bg-slate-100 border border-slate-200/50 px-2.5 py-0.5 text-xs font-mono font-medium text-slate-600">
                                {{ activity.ip || t('adminUsers.activityLog.notAvailable') }}
                            </span>
                        </div>
                        <div v-if="activity.details" class="mt-2">
                            <pre class="p-3 bg-slate-900 text-slate-200 text-xs rounded-lg overflow-x-auto font-mono">{{ JSON.stringify(activity.details, null, 2) }}</pre>
                        </div>
                    </div>
                </div>
                <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
                    <button type="button" @click="showActivityModal = false"
                        class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                        {{ t('adminUsers.form.close') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
    MoreHorizontal, 
    X as XIcon, 
    ChevronDown, 
    UserPlus, 
    CheckCircle2, 
    Clock, 
    XCircle, 
    ShieldCheck, 
    ShieldAlert, 
    UserCheck, 
    UserX, 
    UserMinus, 
    Calendar as CalendarIcon,
    AlertCircle
} from 'lucide-vue-next'
import { useAdminStore } from '../../store/admin.js'
import apiClient from '@/api/axios'
import { toast } from 'vue-sonner'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'

export default {
    name: 'AdminUsers',
    components: {
        MoreHorizontal,
        XIcon,
        ChevronDown,
        UserPlus,
        CheckCircle2,
        Clock,
        XCircle,
        ShieldCheck,
        ShieldAlert,
        UserCheck,
        UserX,
        UserMinus,
        CalendarIcon,
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuTrigger,
        DropdownMenuSeparator,
        DropdownMenuLabel,
    },
    setup() {
        const { t } = useI18n()
        const adminStore = useAdminStore();
        const adminUsers = ref([])
        const regularUsers = ref([])
        const sellerUsers = ref([])
        const activeTab = ref('admins')
        const showCreateModal = ref(false)
        const selectedUser = ref(null)
        const activeDropdown = ref(null)
        const showActivityModal = ref(false)
        const activityLog = ref([])

        // Pagination
        const currentPage = ref(1)
        const itemsPerPage = ref(10)

        // Filters
        const filters = ref({
            search: '',
            status: '',
            role: '',
            verificationStatus: ''
        })

        const resetPagination = () => {
            currentPage.value = 1
        }

        const clearFilters = () => {
            filters.value = {
                search: '',
                status: '',
                role: '',
                verificationStatus: ''
            }
            currentPage.value = 1
        }

        const formData = ref({
            username: '',
            email: '',
            password: '',
            role: 'User',
            isSeller: false,
            storeName: '',
            storeDescription: ''
        })

        const displayedUsers = computed(() => {
            switch (activeTab.value) {
                case 'admins':
                    return adminUsers.value
                case 'users':
                    return regularUsers.value
                case 'sellers':
                    return sellerUsers.value
                default:
                    return []
            }
        })

        const filteredUsers = computed(() => {
            let list = []
            switch (activeTab.value) {
                case 'admins':
                    list = adminUsers.value
                    break
                case 'users':
                    list = regularUsers.value
                    break
                case 'sellers':
                    list = sellerUsers.value
                    break
                default:
                    list = []
            }

            if (filters.value.search) {
                const searchLower = filters.value.search.toLowerCase()
                list = list.filter(user => 
                    user.username?.toLowerCase().includes(searchLower) ||
                    user.email?.toLowerCase().includes(searchLower) ||
                    user.storeName?.toLowerCase().includes(searchLower)
                )
            }

            if (filters.value.status) {
                if (filters.value.status === 'blocked') {
                    list = list.filter(user => user.isBlocked)
                } else if (filters.value.status === 'active') {
                    list = list.filter(user => !user.isBlocked)
                }
            }

            if (activeTab.value === 'admins' && filters.value.role) {
                list = list.filter(user => user.role === filters.value.role)
            }

            if (activeTab.value === 'sellers' && filters.value.verificationStatus) {
                list = list.filter(user => user.verificationStatus === filters.value.verificationStatus)
            }

            return list
        })

        const totalItems = computed(() => filteredUsers.value.length)
        const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage.value)))
        const startItem = computed(() => totalItems.value === 0 ? 0 : ((currentPage.value - 1) * itemsPerPage.value) + 1)
        const endItem = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalItems.value))

        const paginatedUsers = computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage.value
            const end = start + itemsPerPage.value
            return filteredUsers.value.slice(start, end)
        })

        const prevPage = () => {
            if (currentPage.value > 1) {
                currentPage.value--
            }
        }

        const nextPage = () => {
            if (currentPage.value < totalPages.value) {
                currentPage.value++
            }
        }

        // Reset to page 1 and clear filters when activeTab changes
        watch(activeTab, () => {
            clearFilters()
        })

        const closeDropdown = () => {
            activeDropdown.value = null
        }

        const toggleDropdown = (userId) => {
            activeDropdown.value = activeDropdown.value === userId ? null : userId
        }

        // const fetchUsers = async () => {
        //     try {
        //         if (activeTab.value === 'admins') {
        //             const response = await apiClient.get('/admin/users')
        //             adminUsers.value = response.data
        //         } else if (activeTab.value === 'users') {
        //             const response = await apiClient.get('/admin/regular-users')
        //             regularUsers.value = response.data
        //         } else if (activeTab.value === 'sellers') {
        //             const response = await apiClient.get('/admin/sellers')
        //             sellerUsers.value = response.data
        //         }
        //     } catch (error) {
        //         console.error(`Error fetching ${activeTab.value}:`, error)
        //         toast.error(`Failed to fetch ${activeTab.value}`)
        //     }
        // }

        const fetchUsers = async () => {
            try {
                if (activeTab.value === 'admins') {
                    const response = await apiClient.get('/admin/users')
                    adminUsers.value = response.data
                } else if (activeTab.value === 'users') {
                    const response = await apiClient.get('/admin/regular-users')
                    regularUsers.value = response.data
                } else if (activeTab.value === 'sellers') {
                    const response = await apiClient.get('/admin/sellers?limit=1000')
                    console.log('Seller response:', response.data) // Debug log

                    if (!response.data || !response.data.sellers) {
                        sellerUsers.value = []
                        return
                    }

                    sellerUsers.value = response.data.sellers.map(seller => ({
                        _id: seller._id,
                        username: seller.user?.username || t('adminUsers.defaults.unknown'),
                        email: seller.user?.email || t('adminUsers.activityLog.notAvailable'),
                        storeName: seller.storeName || t('adminUsers.defaults.unnamedStore'),
                        storeDescription: seller.storeDescription || '',
                        verificationStatus: seller.verificationStatus || 'not_submitted',
                        lastLogin: seller.user?.lastLogin,
                        twoFactorEnabled: seller.user?.twoFactorEnabled || false,
                        isBlocked: seller.user?.isBlocked || false,
                        isVacationMode: seller.isVacationMode || false,
                        totalSales: seller.totalSales || 0,
                        totalProducts: seller.products?.length || 0,
                        averageRating: seller.averageRating || 0,
                        createdAt: seller.createdAt,
                        updatedAt: seller.updatedAt,
                        status: seller.user?.isBlocked ? t('adminUsers.status.blocked') : (seller.isVacationMode ? t('adminUsers.status.vacation') : t('adminUsers.status.active')),
                        role: t('adminUsers.roles.seller')
                    }))
                }
            } catch (error) {
                console.error(`Error fetching ${activeTab.value}:`, error)
                toast.error(t('adminUsers.toasts.fetchFailed', { tab: activeTab.value }))
            }
        }

        const handleSubmit = async () => {
            try {
                if (selectedUser.value) {
                    const endpoint = activeTab.value === 'admins'
                        ? `/admin/users/${selectedUser.value._id}`
                        : activeTab.value === 'sellers'
                            ? `/admin/sellers/${selectedUser.value._id}`
                            : `/admin/regular-users/${selectedUser.value._id}`

                    await apiClient.put(endpoint, formData.value)
                    toast.success(t('adminUsers.toasts.updated'))
                } else {
                    if (activeTab.value === 'sellers') {
                        await apiClient.post('/admin/sellers', formData.value)
                    } else if (activeTab.value === 'admins') {
                        await apiClient.post('/admin/register', formData.value)
                    } else {
                        await apiClient.post('/admin/regular-users', formData.value)
                    }
                    toast.success(t('adminUsers.toasts.created'))
                }

                await fetchUsers()
                showCreateModal.value = false
                resetForm()
            } catch (error) {
                console.error('Error submitting form:', error)
                toast.error(error.response?.data?.message || t('adminUsers.toasts.operationFailed'))
            }
        }

        const editUser = (user) => {
            selectedUser.value = user
            formData.value = {
                username: user.username,
                email: user.email,
                role: activeTab.value === 'admins' ? user.role : 'User',
                isSeller: user.isSeller || false,
                storeName: user.storeName || '',
                storeDescription: user.storeDescription || ''
            }
            showCreateModal.value = true
        }

        const deleteUser = async (userId) => {
            if (!confirm(t('adminUsers.confirmDelete'))) return;
            try {
                const endpoint = activeTab.value === 'admins'
                    ? `/admin/users/${userId}`
                    : activeTab.value === 'sellers'
                        ? `/admin/sellers/${userId}`
                        : `/admin/regular-users/${userId}`;

                await apiClient.delete(endpoint);
                await fetchUsers();
                toast.success(t('adminUsers.toasts.deleted'));
            } catch (error) {
                console.error('Delete user error:', error);
                toast.error(error.response?.data?.message || t('adminUsers.toasts.deleteFailed'));
            }
        };

        const resetPassword = async (userId) => {
            try {
                const response = await adminStore.resetUserPassword(userId, activeTab.value);
                if (response.success) {
                    toast.success(response.message);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || t('adminUsers.toasts.resetPasswordFailed'));
            }
        };

        const toggle2FA = async (userId) => {
            try {
                const response = await adminStore.toggle2FA(userId, activeTab.value);
                if (response.success) {
                    const users = {
                        'admins': adminUsers,
                        'users': regularUsers,
                        'sellers': sellerUsers
                    }[activeTab.value];

                    const userIndex = users.value.findIndex(u => u._id === userId);
                    if (userIndex !== -1) {
                        users.value[userIndex].twoFactorEnabled = !users.value[userIndex].twoFactorEnabled;

                        // Save to localStorage based on user type
                        if (activeTab.value === 'sellers') {
                            localStorage.setItem('sellers', JSON.stringify(sellerUsers.value));
                        } else if (activeTab.value === 'admins') {
                            localStorage.setItem('adminUsers', JSON.stringify(adminUsers.value));
                        }
                    }
                    toast.success(response.message);
                    // await fetchUsers();
                }
            } catch (error) {
                toast.error(error.response?.data?.message || t('adminUsers.toasts.toggle2faFailed'));
            }
        };

        // const toggleBlockStatus = async (userId) => {
        //     try {
        //         const response = await adminStore.toggleBlockStatus(userId, activeTab.value);
        //         if (response.success) {
        //             // Update the user in the local state
        //             const userIndex = sellerUsers.value.findIndex(u => u._id === userId);
        //             if (userIndex !== -1) {
        //                 sellerUsers.value[userIndex].isBlocked = !sellerUsers.value[userIndex].isBlocked;
        //                 sellerUsers.value[userIndex].status = sellerUsers.value[userIndex].isBlocked ? 'Blocked' : 'Active';
        //             }
        //             toast.success(response.message);
        //             // await fetchUsers();
        //         }
        //     } catch (error) {
        //         toast.error(error.response?.data?.message || 'Failed to toggle block status');
        //     }
        // };

        const toggleBlockStatus = async (userId) => {
            try {
                const response = await adminStore.toggleBlockStatus(userId, activeTab.value);
                if (response.success) {
                    await fetchUsers(); // Add this line to refresh data
                    toast.success(response.message);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || t('adminUsers.toasts.toggleBlockFailed'));
            }
        };

        const viewActivityLog = async (userId) => {
            try {
                const response = await adminStore.getUserActivity(userId, activeTab.value);
                if (response.success) {
                    activityLog.value = response.activities || [];
                    showActivityModal.value = true;
                    closeDropdown();

                    if (activityLog.value.length === 0) {
                        toast.info(t('adminUsers.toasts.noActivity'));
                    }
                }
            } catch (error) {
                console.error('Activity log error:', error);
                toast.error(error.response?.data?.message || t('adminUsers.toasts.activityFetchFailed'));
            }
        };

        const managePermissions = (userId) => {
            // Implementation pending
            toast.info(t('adminUsers.toasts.permissionsSoon'));
        };

        const forceLogout = async (userId) => {
            try {
                const response = await adminStore.forceLogout(userId, activeTab.value);
                if (response.success) {
                    toast.success(response.message);
                    await fetchUsers();
                }
            } catch (error) {
                toast.error(error.response?.data?.message || t('adminUsers.toasts.forceLogoutFailed'));
            }
        };

        const toggleVerification = async (userId) => {
            try {
                const response = await adminStore.updateSellerStatus(userId, {
                    verificationStatus: displayedUsers.value.find(u => u._id === userId).verificationStatus === 'approved' ? 'rejected' : 'approved'
                })
                if (response.success) {
                    await fetchUsers()
                    toast.success(t('adminUsers.toasts.verificationUpdated'))
                }
            } catch (error) {
                console.error('Error toggling verification:', error)
                toast.error(t('adminUsers.toasts.verificationUpdateFailed'))
            }
        }

        const resetForm = () => {
            selectedUser.value = null
            formData.value = {
                username: '',
                email: '',
                password: '',
                role: 'User',
                isSeller: false,
                storeName: '',
                storeDescription: ''
            }
        }

        const updateFormDataRole = () => {
            if (activeTab.value === 'admins') {
                formData.value.role = 'Admin'
            } else if (activeTab.value === 'sellers') {
                formData.value.role = 'User'
                formData.value.isSeller = true
            } else {
                formData.value.role = 'User'
                formData.value.isSeller = false
            }
        }

        const formatJustDate = (date) => {
            if (!date) return '';
            return new Date(date).toLocaleDateString('en-NG', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        };

        const formatJustTime = (date) => {
            if (!date) return '';
            return new Date(date).toLocaleTimeString('en-NG', {
                hour: '2-digit',
                minute: '2-digit',
            });
        };

        const getInitials = (username, email) => {
            if (username) {
                const parts = username.trim().split(/\s+/);
                if (parts.length >= 2) {
                    return (parts[0][0] + parts[1][0]).toUpperCase();
                }
                if (parts.length === 1 && parts[0]) {
                    return parts[0].substring(0, 2).toUpperCase();
                }
            }
            if (email) {
                return email.substring(0, 2).toUpperCase();
            }
            return '??';
        };

        const getStatusClass = (user) => {
            if (activeTab.value === 'sellers') {
                if (user.isBlocked) return 'bg-rose-50 text-rose-700 border-rose-200/50'
                if (user.verificationStatus === 'approved') return 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                return 'bg-amber-50 text-amber-700 border-amber-200/50'
            }

            if (activeTab.value === 'admins') {
                if (user.isBlocked) return 'bg-rose-50 text-rose-700 border-rose-200/50'
                if (!user.lastLogin) return 'bg-slate-50 text-slate-600 border-slate-200/50'
                return Date.now() - new Date(user.lastLogin) < 3600000
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                    : 'bg-slate-50 text-slate-600 border-slate-200/50'
            }

            if (user.isBlocked) return 'bg-rose-50 text-rose-700 border-rose-200/50'
            return user.isSeller
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                : 'bg-blue-50 text-blue-700 border-blue-200/50'
        }

        const getStatusText = (user) => {
            if (activeTab.value === 'sellers') {
                if (user.isBlocked) return t('adminUsers.status.blocked')
                if (user.verificationStatus === 'approved') return t('adminUsers.status.verified')
                return t('adminUsers.status.pendingVerification')
            }

            if (activeTab.value === 'admins') {
                if (user.isBlocked) return t('adminUsers.status.blocked')
                if (!user.lastLogin) return t('adminUsers.status.neverLoggedIn')
                return Date.now() - new Date(user.lastLogin) < 3600000
                    ? t('adminUsers.status.online')
                    : t('adminUsers.status.offline')
            }

            if (user.isBlocked) return t('adminUsers.status.blocked')
            return user.isSeller ? t('adminUsers.roles.seller') : t('adminUsers.status.customer')
        }

        const getStatusIcon = (user) => {
            if (activeTab.value === 'sellers') {
                if (user.isBlocked) return UserX;
                if (user.verificationStatus === 'approved') return UserCheck;
                return Clock;
            }
            if (activeTab.value === 'admins') {
                if (user.isBlocked) return UserX;
                if (!user.lastLogin) return UserMinus;
                return Date.now() - new Date(user.lastLogin) < 3600000 ? UserCheck : UserMinus;
            }
            if (user.isBlocked) return UserX;
            return user.isSeller ? UserCheck : UserCheck;
        };

        const get2FAClass = (enabled) => {
            return enabled ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' : 'bg-slate-50 text-slate-600 border-slate-200/50';
        };

        const get2FAIcon = (enabled) => {
            return enabled ? ShieldCheck : ShieldAlert;
        };

        const getVerificationClass = (status) => {
            const classes = {
                approved: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
                pending: 'bg-amber-50 text-amber-700 border-amber-200/50',
                rejected: 'bg-rose-50 text-rose-700 border-rose-200/50',
            };
            return classes[status] || 'bg-slate-50 text-slate-600 border-slate-200/50';
        };

        const getVerificationIcon = (status) => {
            const icons = {
                approved: CheckCircle2,
                pending: Clock,
                rejected: XCircle,
            };
            return icons[status] || AlertCircle;
        };

        watch(activeTab, () => {
            fetchUsers()
        })

        onMounted(() => {
            fetchUsers()
        })

        return {
            adminUsers,
            regularUsers,
            sellerUsers,
            activeTab,
            showCreateModal,
            selectedUser,
            formData,
            displayedUsers,
            handleSubmit,
            editUser,
            deleteUser,
            resetPassword,
            toggle2FA,
            toggleBlockStatus,
            viewActivityLog,
            managePermissions,
            forceLogout,
            getStatusClass,
            getStatusText,
            getStatusIcon,
            get2FAClass,
            get2FAIcon,
            getVerificationClass,
            getVerificationIcon,
            toggleVerification,
            activeDropdown,
            toggleDropdown,
            closeDropdown,
            showActivityModal,
            activityLog,
            updateFormDataRole,
            currentPage,
            totalPages,
            startItem,
            endItem,
            totalItems,
            paginatedUsers,
            prevPage,
            nextPage,
            filters,
            resetPagination,
            clearFilters,
            formatJustDate,
            formatJustTime,
            getInitials,
            t
        }
    }
}
</script>

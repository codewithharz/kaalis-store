<!-- frontend/src/views/admin/AdminUsers.vue -->
<template>
    <div>
        <div class="px-8 py-4 bg-white flex justify-between items-center">
            <h3 class="text-2xl font-semibold text-gray-800">User Management</h3>
            <button @click="showCreateModal = true"
                class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Add New User
            </button>
        </div>

        <!-- User Type Toggle -->
        <div class="mb-3 bg-white rounded-b-lg">
            <div class="border-b border-gray-200">
                <nav class="-mb-px flex" aria-label="Tabs">
                    <button @click="activeTab = 'admins'" :class="[
                        activeTab === 'admins' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                        'w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm'
                    ]">
                        Admin Users
                    </button>
                    <button @click="activeTab = 'users'" :class="[
                        activeTab === 'users' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                        'w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm'
                    ]">
                        Regular Users
                    </button>
                    <button @click="activeTab = 'sellers'" :class="[
                        activeTab === 'sellers' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                        'w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm'
                    ]">
                        Seller Users
                    </button>
                </nav>
            </div>
        </div>

        <!-- Users Table -->
        <div class="bg-white shadow rounded-lg overflow-hidden">
            <!-- Wrapping the table in a div that allows horizontal scrolling -->
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                                User</th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                                Email</th>
                            <template v-if="activeTab === 'sellers'">
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                                    Store Name</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                    Verification</th>
                            </template>
                            <template v-else>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                    Role</th>
                            </template>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                                Last Login</th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                2FA</th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                Status</th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="user in displayedUsers" :key="user._id">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">{{ user.username }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-500">{{ user.email }}</div>
                            </td>
                            <template v-if="activeTab === 'sellers'">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ user.storeName }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span :class="[
                                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                                        {
                                            'bg-green-100 text-green-800': user.verificationStatus === 'approved',
                                            'bg-yellow-100 text-yellow-800': user.verificationStatus === 'pending',
                                            'bg-gray-100 text-gray-800': !user.verificationStatus || user.verificationStatus === 'rejected'
                                        }
                                    ]">
                                        {{ user.verificationStatus || 'Not Verified' }}
                                    </span>
                                </td>
                            </template>
                            <template v-else>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ user.role }}
                                </td>
                            </template>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="[
                                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                                    user.twoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                ]">
                                    {{ user.twoFactorEnabled ? 'Enabled' : 'Disabled' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="[
                                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                                    getStatusClass(user)
                                ]">
                                    {{ getStatusText(user) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex items-center justify-end space-x-3">
                                    <button @click="editUser(user)" class="text-indigo-600 hover:text-indigo-900">
                                        Edit
                                    </button>
                                    <div class="relative">
                                        <button @click="toggleDropdown(user._id)"
                                            class="flex items-center text-gray-400 hover:text-gray-600">
                                            <DotsVerticalIcon class="h-5 w-5" />
                                        </button>

                                        <div v-if="activeDropdown === user._id"
                                            class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-200 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <button @click="resetPassword(user._id)"
                                                class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                                                Reset Password
                                            </button>
                                            <button @click="toggle2FA(user._id)"
                                                class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                                                {{ user.twoFactorEnabled ? 'Disable' : 'Enable' }} 2FA
                                            </button>
                                            <button @click="toggleBlockStatus(user._id)"
                                                class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                                                {{ user.isBlocked ? 'Unblock' : 'Block' }} User
                                            </button>
                                            <template v-if="activeTab === 'sellers'">
                                                <button @click="toggleVerification(user._id)"
                                                    class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                                                    {{ user.verificationStatus === 'approved' ? 'Revoke' : 'Approve' }}
                                                    Verification
                                                </button>
                                            </template>
                                            <button @click="viewActivityLog(user._id)"
                                                class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                                                View Activity Log
                                            </button>
                                            <button @click="managePermissions(user._id)"
                                                class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                                                Manage Permissions
                                            </button>
                                            <button @click="forceLogout(user._id)"
                                                class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                                                Force Logout
                                            </button>
                                            <button @click="deleteUser(user._id)"
                                                class="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded-lg w-full max-w-md">
                <h3 class="text-lg font-medium text-gray-900 mb-4">
                    {{ selectedUser ? 'Edit User' : 'Create New User' }}
                </h3>
                <form @submit.prevent="handleSubmit">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Username</label>
                            <input v-model="formData.username" type="text"
                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Email</label>
                            <input v-model="formData.email" type="email"
                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">User Type</label>
                            <select v-model="activeTab"
                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                @change="updateFormDataRole">
                                <option value="admins">Admin</option>
                                <option value="users">Regular User</option>
                                <option value="sellers">Seller</option>
                            </select>
                        </div>
                        <template v-if="activeTab === 'admins'">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Role</label>
                                <select v-model="formData.role"
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                    <option value="User">User</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Moderator">Moderator</option>
                                </select>
                            </div>
                        </template>
                        <template v-if="activeTab === 'sellers'">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Store Name</label>
                                <input v-model="formData.storeName" type="text"
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Store Description</label>
                                <textarea v-model="formData.storeDescription"
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    rows="3"></textarea>
                            </div>
                        </template>
                        <div v-if="!selectedUser">
                            <label class="block text-sm font-medium text-gray-700">Password</label>
                            <input v-model="formData.password" type="password"
                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" @click="showCreateModal = false"
                            class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md">
                            Cancel
                        </button>
                        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md">
                            {{ selectedUser ? 'Update' : 'Create' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Activity Log Modal -->
        <div v-if="showActivityModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-900">User Activity Log</h3>
                    <button @click="showActivityModal = false" class="text-gray-400 hover:text-gray-500">
                        <XIcon class="h-6 w-6" />
                    </button>
                </div>
                <div class="space-y-4">
                    <div v-for="activity in activityLog" :key="activity.id" class="border-b pb-4">
                        <div class="flex justify-between items-start">
                            <div>
                                <!-- <p class="text-sm font-medium text-gray-900">
                  {{ activity.action.replace('_', ' ').toUpperCase() }} -->
                                <p class="text-sm text-gray-500">{{ activity.formattedDate }}</p>
                            </div>
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100">
                                {{ activity.ip || 'N/A' }}
                            </span>
                        </div>
                        <div v-if="activity.details" class="mt-2">
                            <pre class="text-sm text-gray-600 whitespace-pre-wrap">{{ JSON.stringify(activity.details, null, 2)
                        }}</pre>
                        </div>
                    </div>
                </div>
                <div class="mt-6 flex justify-end">
                    <button type="button" @click="showActivityModal = false"
                        class="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200">
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { MoreVertical as DotsVerticalIcon, X as XIcon, ChevronDown } from 'lucide-vue-next'
import { useAdminStore } from '../../store/admin.js'
import apiClient from '@/api/axios'
import { toast } from 'vue-sonner'

export default {
    name: 'AdminUsers',
    components: {
        DotsVerticalIcon,
        XIcon,
        ChevronDown
    },
    setup() {
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
                    const response = await apiClient.get('/admin/sellers')
                    console.log('Seller response:', response.data) // Debug log

                    if (!response.data || !response.data.sellers) {
                        sellerUsers.value = []
                        return
                    }

                    sellerUsers.value = response.data.sellers.map(seller => ({
                        _id: seller._id,
                        username: seller.user?.username || 'Unknown',
                        email: seller.user?.email || 'N/A',
                        storeName: seller.storeName || 'Unnamed Store',
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
                        status: seller.user?.isBlocked ? 'Blocked' : (seller.isVacationMode ? 'Vacation' : 'Active'),
                        role: 'Seller'
                    }))
                }
            } catch (error) {
                console.error(`Error fetching ${activeTab.value}:`, error)
                toast.error(`Failed to fetch ${activeTab.value}`)
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
                    toast.success('User updated successfully')
                } else {
                    if (activeTab.value === 'sellers') {
                        await apiClient.post('/admin/sellers', formData.value)
                    } else if (activeTab.value === 'admins') {
                        await apiClient.post('/admin/register', formData.value)
                    } else {
                        await apiClient.post('/admin/regular-users', formData.value)
                    }
                    toast.success('User created successfully')
                }

                await fetchUsers()
                showCreateModal.value = false
                resetForm()
            } catch (error) {
                console.error('Error submitting form:', error)
                toast.error(error.response?.data?.message || 'Operation failed')
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
            if (!confirm('Are you sure you want to delete this user?')) return;
            try {
                const endpoint = activeTab.value === 'admins'
                    ? `/admin/users/${userId}`
                    : activeTab.value === 'sellers'
                        ? `/admin/sellers/${userId}`
                        : `/admin/regular-users/${userId}`;

                await apiClient.delete(endpoint);
                await fetchUsers();
                toast.success('User deleted successfully');
            } catch (error) {
                console.error('Delete user error:', error);
                toast.error(error.response?.data?.message || 'Failed to delete user');
            }
        };

        const resetPassword = async (userId) => {
            try {
                const response = await adminStore.resetUserPassword(userId, activeTab.value);
                if (response.success) {
                    toast.success(response.message);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to reset password');
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
                toast.error(error.response?.data?.message || 'Failed to toggle 2FA');
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
                toast.error(error.response?.data?.message || 'Failed to toggle block status');
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
                        toast.info('No activity records found for this user');
                    }
                }
            } catch (error) {
                console.error('Activity log error:', error);
                toast.error(error.response?.data?.message || 'Failed to fetch activity log');
            }
        };

        const managePermissions = (userId) => {
            // Implementation pending
            toast.info('Permission management coming soon');
        };

        const forceLogout = async (userId) => {
            try {
                const response = await adminStore.forceLogout(userId, activeTab.value);
                if (response.success) {
                    toast.success(response.message);
                    await fetchUsers();
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to force logout');
            }
        };

        const toggleVerification = async (userId) => {
            try {
                const response = await adminStore.updateSellerStatus(userId, {
                    verificationStatus: displayedUsers.value.find(u => u._id === userId).verificationStatus === 'approved' ? 'rejected' : 'approved'
                })
                if (response.success) {
                    await fetchUsers()
                    toast.success('Verification status updated successfully')
                }
            } catch (error) {
                console.error('Error toggling verification:', error)
                toast.error('Failed to update verification status')
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

        const getStatusClass = (user) => {
            if (activeTab.value === 'sellers') {
                if (user.isBlocked) return 'bg-red-100 text-red-800'
                if (user.verificationStatus === 'approved') return 'bg-green-100 text-green-800'
                return 'bg-yellow-100 text-yellow-800'
            }

            if (activeTab.value === 'admins') {
                if (!user.lastLogin) return 'bg-yellow-100 text-yellow-800'
                return Date.now() - new Date(user.lastLogin) < 3600000
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
            }

            if (user.isBlocked) return 'bg-red-100 text-red-800'
            return user.isSeller
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
        }

        const getStatusText = (user) => {
            if (activeTab.value === 'sellers') {
                if (user.isBlocked) return 'Blocked'
                if (user.verificationStatus === 'approved') return 'Verified'
                return 'Pending Verification'
            }

            if (activeTab.value === 'admins') {
                if (user.isBlocked) return 'Blocked'
                if (!user.lastLogin) return 'Never Logged In'
                return Date.now() - new Date(user.lastLogin) < 3600000
                    ? 'Online'
                    : 'Offline'
            }

            if (user.isBlocked) return 'Blocked'
            return user.isSeller ? 'Seller' : 'Customer'
        }

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
            toggleVerification,
            activeDropdown,
            toggleDropdown,
            closeDropdown,
            showActivityModal,
            activityLog,
            updateFormDataRole
        }
    }
}
</script>
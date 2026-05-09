<template>
    <div class="space-y-6">
        <div class="rounded-lg bg-white px-4 py-5 shadow-sm sm:px-6">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 class="text-2xl font-bold text-slate-900">{{ t('adminSettings.title') }}</h2>
                    <p class="mt-1 max-w-3xl text-sm text-slate-600">
                        Keep the platform fee, payout schedule, and rail availability aligned with the logic Kaalis is
                        actually using at runtime.
                    </p>
                </div>
                <button
                    type="button"
                    @click="saveSettings"
                    :disabled="loading || saving"
                    class="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {{ saving ? 'Saving...' : t('adminSettings.saveChanges') }}
                </button>
            </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Checkout fee</p>
                <p class="mt-2 text-2xl font-semibold text-slate-900">{{ settings.payment.checkoutPlatformFeePercent }}%</p>
                <p class="mt-1 text-sm text-slate-500">Used when Kaalis creates order splits at checkout.</p>
            </section>
            <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Default vendor share</p>
                <p class="mt-2 text-2xl font-semibold text-slate-900">{{ settings.payouts.defaultTier.vendorSharePercent }}%</p>
                <p class="mt-1 text-sm text-slate-500">Standard vendor settlement share for payout batches.</p>
            </section>
            <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Premium vendor share</p>
                <p class="mt-2 text-2xl font-semibold text-slate-900">{{ settings.payouts.premiumTier.vendorSharePercent }}%</p>
                <p class="mt-1 text-sm text-slate-500">Applied later during premium payout settlement.</p>
            </section>
            <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Maintenance mode</p>
                <p class="mt-2 text-2xl font-semibold text-slate-900">{{ settings.general.maintenanceMode ? 'On' : 'Off' }}</p>
                <p class="mt-1 text-sm text-slate-500">Public runtime flag from Kaalis platform settings.</p>
            </section>
        </div>

        <div class="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
            <aside class="rounded-lg bg-white p-3 shadow-sm">
                <nav class="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                    <button
                        v-for="tab in tabs"
                        :key="tab.id"
                        type="button"
                        @click="currentTab = tab.id"
                        :class="[
                            'rounded-md px-3 py-2 text-left text-sm font-medium transition',
                            currentTab === tab.id
                                ? 'bg-slate-900 text-white'
                                : 'text-slate-700 hover:bg-slate-100'
                        ]"
                    >
                        {{ tab.name }}
                    </button>
                </nav>
            </aside>

            <div class="rounded-lg bg-white p-4 shadow-sm sm:p-6">
                <div v-if="loading" class="py-12 text-center text-sm text-slate-500">Loading platform settings...</div>

                <template v-else>
                    <div v-if="currentTab === 'general'" class="space-y-6">
                        <section>
                            <h3 class="text-lg font-semibold text-slate-900">General</h3>
                            <p class="mt-1 text-sm text-slate-500">Basic platform identity and runtime defaults.</p>
                        </section>

                        <div class="grid gap-4 md:grid-cols-2">
                            <label class="space-y-1 text-sm">
                                <span class="font-medium text-slate-700">Platform name</span>
                                <input v-model="settings.general.platformName" type="text" class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none">
                            </label>
                            <label class="space-y-1 text-sm">
                                <span class="font-medium text-slate-700">Support email</span>
                                <input v-model="settings.general.supportEmail" type="email" class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none">
                            </label>
                            <label class="space-y-1 text-sm">
                                <span class="font-medium text-slate-700">Default currency</span>
                                <select v-model="settings.general.currency" class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none">
                                    <option value="NGN">NGN</option>
                                    <option value="XOF">XOF</option>
                                </select>
                            </label>
                            <label class="space-y-1 text-sm">
                                <span class="font-medium text-slate-700">Timezone</span>
                                <select v-model="settings.general.timezone" class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none">
                                    <option value="WAT">WAT</option>
                                    <option value="UTC">UTC</option>
                                    <option value="GMT">GMT</option>
                                </select>
                            </label>
                        </div>

                        <label class="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
                            <input v-model="settings.general.maintenanceMode" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500">
                            <span>
                                <span class="block font-medium text-slate-800">Maintenance mode</span>
                                <span class="block text-slate-500">Expose a platform-wide flag for planned maintenance windows.</span>
                            </span>
                        </label>
                    </div>

                    <div v-else-if="currentTab === 'commerce'" class="space-y-6">
                        <section>
                            <h3 class="text-lg font-semibold text-slate-900">Commerce</h3>
                            <p class="mt-1 text-sm text-slate-500">
                                This checkout fee is the number the storefront now uses when it creates vendor/platform splits.
                            </p>
                        </section>

                        <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
                            <div class="rounded-lg border border-slate-200 p-4">
                                <label class="space-y-1 text-sm">
                                    <span class="font-medium text-slate-700">Checkout platform fee (%)</span>
                                    <input
                                        v-model.number="settings.payment.checkoutPlatformFeePercent"
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none"
                                    >
                                </label>
                                <div class="mt-3 rounded-md bg-amber-50 p-3 text-sm text-amber-900">
                                    <p class="font-medium">Source of truth</p>
                                    <p class="mt-1">
                                        Checkout uses this fee for order splits. Vendor payout tiers below can still settle vendors differently later.
                                    </p>
                                </div>
                            </div>

                            <div class="rounded-lg border border-slate-200 p-4">
                                <h4 class="text-sm font-semibold uppercase tracking-wide text-slate-500">Payment rails</h4>
                                <div class="mt-4 space-y-3">
                                    <div v-for="rail in paymentRails" :key="rail.key" class="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2">
                                        <div>
                                            <p class="text-sm font-medium text-slate-800">{{ rail.label }}</p>
                                            <p class="text-xs text-slate-500">{{ rail.description }}</p>
                                        </div>
                                        <span :class="rail.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'" class="rounded-full px-2.5 py-1 text-xs font-semibold">
                                            {{ rail.enabled ? 'Configured' : 'Unavailable' }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-else-if="currentTab === 'payouts'" class="space-y-6">
                        <section>
                            <h3 class="text-lg font-semibold text-slate-900">Payouts</h3>
                            <p class="mt-1 text-sm text-slate-500">These rules drive vendor settlement timing and share after orders are paid.</p>
                        </section>

                        <div class="grid gap-6 xl:grid-cols-2">
                            <section class="rounded-lg border border-slate-200 p-4">
                                <h4 class="text-base font-semibold text-slate-900">Default tier</h4>
                                <div class="mt-4 grid gap-4 sm:grid-cols-2">
                                    <label class="space-y-1 text-sm">
                                        <span class="font-medium text-slate-700">Vendor share (%)</span>
                                        <input v-model.number="settings.payouts.defaultTier.vendorSharePercent" type="number" min="0" max="100" class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none">
                                    </label>
                                    <label class="space-y-1 text-sm">
                                        <span class="font-medium text-slate-700">Holding period (days)</span>
                                        <input v-model.number="settings.payouts.defaultTier.holdingPeriod" type="number" min="0" class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none">
                                    </label>
                                    <label class="space-y-1 text-sm">
                                        <span class="font-medium text-slate-700">Minimum payout</span>
                                        <input v-model.number="settings.payouts.defaultTier.minimumAmount" type="number" min="0" class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none">
                                    </label>
                                    <label class="space-y-1 text-sm">
                                        <span class="font-medium text-slate-700">Batch size</span>
                                        <input v-model.number="settings.payouts.defaultTier.batchSize" type="number" min="1" class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none">
                                    </label>
                                </div>
                            </section>

                            <section class="rounded-lg border border-slate-200 p-4">
                                <h4 class="text-base font-semibold text-slate-900">Premium tier</h4>
                                <div class="mt-4 grid gap-4 sm:grid-cols-2">
                                    <label class="space-y-1 text-sm">
                                        <span class="font-medium text-slate-700">Vendor share (%)</span>
                                        <input v-model.number="settings.payouts.premiumTier.vendorSharePercent" type="number" min="0" max="100" class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none">
                                    </label>
                                    <label class="space-y-1 text-sm">
                                        <span class="font-medium text-slate-700">Holding period (days)</span>
                                        <input v-model.number="settings.payouts.premiumTier.holdingPeriod" type="number" min="0" class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none">
                                    </label>
                                    <label class="space-y-1 text-sm">
                                        <span class="font-medium text-slate-700">Minimum payout</span>
                                        <input v-model.number="settings.payouts.premiumTier.minimumAmount" type="number" min="0" class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none">
                                    </label>
                                    <label class="space-y-1 text-sm">
                                        <span class="font-medium text-slate-700">Batch size</span>
                                        <input v-model.number="settings.payouts.premiumTier.batchSize" type="number" min="1" class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none">
                                    </label>
                                </div>
                            </section>
                        </div>

                        <section class="rounded-lg border border-slate-200 p-4">
                            <h4 class="text-base font-semibold text-slate-900">Retry and notifications</h4>
                            <div class="mt-4 grid gap-4 lg:grid-cols-2">
                                <label class="space-y-1 text-sm">
                                    <span class="font-medium text-slate-700">Max retry attempts</span>
                                    <input v-model.number="settings.payouts.retryStrategy.maxAttempts" type="number" min="0" class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none">
                                </label>
                                <label class="space-y-1 text-sm">
                                    <span class="font-medium text-slate-700">Reminder hours</span>
                                    <input v-model.number="settings.payouts.notifications.reminderHours" type="number" min="0" class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none">
                                </label>
                            </div>
                            <div class="mt-4 grid gap-3 md:grid-cols-3">
                                <label class="flex items-center gap-3 rounded-md border border-slate-100 px-3 py-2 text-sm">
                                    <input v-model="settings.payouts.notifications.sendVendorNotifications" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500">
                                    <span>Notify vendors</span>
                                </label>
                                <label class="flex items-center gap-3 rounded-md border border-slate-100 px-3 py-2 text-sm">
                                    <input v-model="settings.payouts.notifications.notifyOnFailure" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500">
                                    <span>Notify on failure</span>
                                </label>
                                <label class="flex items-center gap-3 rounded-md border border-slate-100 px-3 py-2 text-sm">
                                    <input v-model="settings.payouts.notifications.notifyBeforePayout" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500">
                                    <span>Notify before payout</span>
                                </label>
                            </div>
                        </section>
                    </div>

                    <div v-else-if="currentTab === 'shipping'" class="space-y-6">
                        <section>
                            <h3 class="text-lg font-semibold text-slate-900">Shipping</h3>
                            <p class="mt-1 text-sm text-slate-500">Base shipping defaults used when storefront shipping rules fall back to platform values.</p>
                        </section>

                        <div class="grid gap-4 md:grid-cols-2">
                            <label class="space-y-1 text-sm">
                                <span class="font-medium text-slate-700">Base shipping cost</span>
                                <input v-model.number="settings.shipping.baseCost" type="number" min="0" class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none">
                            </label>
                            <label class="space-y-1 text-sm">
                                <span class="font-medium text-slate-700">Free shipping threshold</span>
                                <input v-model.number="settings.shipping.freeThreshold" type="number" min="0" class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none">
                            </label>
                        </div>

                        <section class="rounded-lg border border-slate-200 p-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h4 class="text-base font-semibold text-slate-900">Shipping zones</h4>
                                    <p class="text-sm text-slate-500">Optional fallback zones for admin-managed shipping defaults.</p>
                                </div>
                                <button type="button" @click="addShippingZone" class="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                                    Add zone
                                </button>
                            </div>

                            <div class="mt-4 space-y-4">
                                <div v-if="!settings.shipping.zones.length" class="rounded-md border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                                    No fallback shipping zones yet.
                                </div>
                                <div
                                    v-for="(zone, index) in settings.shipping.zones"
                                    :key="index"
                                    class="rounded-lg border border-slate-100 p-4"
                                >
                                    <div class="grid gap-4 lg:grid-cols-[1fr_1.2fr_180px]">
                                        <label class="space-y-1 text-sm">
                                            <span class="font-medium text-slate-700">Zone name</span>
                                            <input v-model="zone.name" type="text" class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none">
                                        </label>
                                        <label class="space-y-1 text-sm">
                                            <span class="font-medium text-slate-700">Regions</span>
                                            <input v-model="zone.regions" type="text" class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none" placeholder="Lagos, Abuja, Dakar">
                                        </label>
                                        <label class="space-y-1 text-sm">
                                            <span class="font-medium text-slate-700">Rate</span>
                                            <input v-model.number="zone.rate" type="number" min="0" class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none">
                                        </label>
                                    </div>
                                    <div class="mt-3 flex justify-end">
                                        <button type="button" @click="removeShippingZone(index)" class="text-sm font-medium text-rose-600 hover:text-rose-700">
                                            Remove zone
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div v-else-if="currentTab === 'afriexchange'" class="space-y-6">
                        <section>
                            <h3 class="text-lg font-semibold text-slate-900">AfriExchange Integration</h3>
                            <p class="mt-1 text-sm text-slate-500">
                                Keep the Kaalis to AfriExchange merchant link visible, make the current CT strategy explicit,
                                and expose the non-secret runtime values operators need most often.
                            </p>
                        </section>

                        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <section class="rounded-lg border border-slate-200 p-4">
                                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Integration status</p>
                                <p class="mt-2 text-2xl font-semibold text-slate-900">{{ afriExchangeStatus.label }}</p>
                                <p class="mt-1 text-sm text-slate-500">{{ afriExchangeStatus.description }}</p>
                            </section>
                            <section class="rounded-lg border border-slate-200 p-4">
                                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Linked merchant</p>
                                <p class="mt-2 text-lg font-semibold text-slate-900">{{ settings.afriExchange.linkedMerchantName || 'Not set' }}</p>
                                <p class="mt-1 break-all font-mono text-xs text-slate-500">{{ settings.afriExchange.linkedMerchantId || 'Merchant id missing' }}</p>
                            </section>
                            <section class="rounded-lg border border-slate-200 p-4">
                                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Default token</p>
                                <p class="mt-2 text-2xl font-semibold text-slate-900">{{ settings.afriExchange.defaultToken }}</p>
                                <p class="mt-1 text-sm text-slate-500">Current live Kaalis AfriExchange token path.</p>
                            </section>
                            <section class="rounded-lg border border-slate-200 p-4">
                                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Webhook secret</p>
                                <p class="mt-2 text-2xl font-semibold text-slate-900">
                                    {{ settings.runtime?.integrations?.afriExchange?.webhookSecretConfigured ? 'Configured' : 'Missing' }}
                                </p>
                                <p class="mt-1 text-sm text-slate-500">Environment-backed secret status only.</p>
                            </section>
                            <section class="rounded-lg border border-slate-200 p-4">
                                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Last webhook received</p>
                                <p class="mt-2 text-sm font-semibold text-slate-900">
                                    {{ formatAfriExchangeHealthTimestamp(settings.afriExchange.health?.lastWebhookReceivedAt) }}
                                </p>
                                <p class="mt-1 text-xs text-slate-500">
                                    {{ settings.afriExchange.health?.lastWebhookEvent || 'No AfriExchange webhook recorded yet.' }}
                                </p>
                            </section>
                        </div>

                        <div class="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                            <section class="rounded-lg border border-slate-200 p-4">
                                <h4 class="text-base font-semibold text-slate-900">Connection configuration</h4>
                                <div class="mt-4 grid gap-4 md:grid-cols-2">
                                    <label class="space-y-1 text-sm md:col-span-2">
                                        <span class="font-medium text-slate-700">AfriExchange API base URL</span>
                                        <input :value="settings.runtime?.integrations?.afriExchange?.apiBaseUrl || ''" type="text" disabled class="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-slate-600 shadow-sm">
                                    </label>
                                    <label class="space-y-1 text-sm md:col-span-2">
                                        <span class="font-medium text-slate-700">AfriExchange web URL</span>
                                        <input v-model="settings.afriExchange.webAppUrl" type="text" class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none" placeholder="https://afri-x.vercel.app/">
                                    </label>
                                    <label class="space-y-1 text-sm">
                                        <span class="font-medium text-slate-700">Linked merchant name</span>
                                        <input v-model="settings.afriExchange.linkedMerchantName" type="text" class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none">
                                    </label>
                                    <label class="space-y-1 text-sm">
                                        <span class="font-medium text-slate-700">Linked merchant ID</span>
                                        <input v-model="settings.afriExchange.linkedMerchantId" type="text" class="w-full rounded-md border border-slate-200 px-3 py-2 font-mono text-xs shadow-sm focus:border-slate-400 focus:outline-none">
                                    </label>
                                    <label class="space-y-1 text-sm md:col-span-2">
                                        <span class="font-medium text-slate-700">Expected webhook callback URL</span>
                                        <input v-model="settings.afriExchange.webhookCallbackUrl" type="text" class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none" placeholder="http://localhost:7788/api/afriexchange/webhooks">
                                    </label>
                                </div>
                            </section>

                            <section class="rounded-lg border border-slate-200 p-4">
                                <h4 class="text-base font-semibold text-slate-900">Runtime and secrets</h4>
                                <div class="mt-4 space-y-3">
                                    <div class="rounded-md border border-slate-100 px-3 py-2">
                                        <p class="text-sm font-medium text-slate-800">API key</p>
                                        <p class="mt-1 text-sm text-slate-500">
                                            {{ settings.runtime?.integrations?.afriExchange?.apiKeyConfigured ? 'Configured in environment' : 'Missing from environment' }}
                                        </p>
                                    </div>
                                    <div class="rounded-md border border-slate-100 px-3 py-2">
                                        <p class="text-sm font-medium text-slate-800">Webhook secret</p>
                                        <p class="mt-1 text-sm text-slate-500">
                                            {{ settings.runtime?.integrations?.afriExchange?.webhookSecretConfigured ? 'Configured in environment' : 'Missing from environment' }}
                                        </p>
                                    </div>
                                    <div class="rounded-md border border-slate-100 px-3 py-2">
                                        <p class="text-sm font-medium text-slate-800">Operator note</p>
                                        <p class="mt-1 text-sm text-slate-500">
                                            {{ settings.runtime?.notes?.afriExchange || 'AfriExchange runtime note unavailable.' }}
                                        </p>
                                    </div>
                                    <div class="rounded-md border border-slate-100 px-3 py-2">
                                        <p class="text-sm font-medium text-slate-800">Webhook health</p>
                                        <p class="mt-1 text-sm text-slate-500">
                                            Status: {{ settings.afriExchange.health?.lastWebhookStatus || 'No webhook status yet' }}
                                        </p>
                                        <p class="mt-1 break-all text-xs text-slate-400">
                                            Reference: {{ settings.afriExchange.health?.lastWebhookReference || 'Not available yet' }}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <section class="rounded-lg border border-slate-200 p-4">
                            <h4 class="text-base font-semibold text-slate-900">Token strategy</h4>
                            <div class="mt-4 grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                                <div class="space-y-4">
                                    <label class="space-y-1 text-sm">
                                        <span class="font-medium text-slate-700">Default AfriExchange token</span>
                                        <select v-model="settings.afriExchange.defaultToken" class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none">
                                            <option value="CT">CT</option>
                                            <option value="NT">NT</option>
                                            <option value="USDT">USDT</option>
                                        </select>
                                    </label>

                                    <div class="space-y-2 text-sm">
                                        <span class="font-medium text-slate-700">Allowed tokens</span>
                                        <div class="grid gap-2 sm:grid-cols-3">
                                            <label v-for="token in tokenOptions" :key="token" class="flex items-center gap-3 rounded-md border border-slate-100 px-3 py-2">
                                                <input
                                                    :checked="settings.afriExchange.allowedTokens.includes(token)"
                                                    type="checkbox"
                                                    class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                                                    @change="toggleAllowedToken(token)"
                                                >
                                                <span>{{ token }}</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div class="space-y-4">
                                    <label class="space-y-1 text-sm">
                                        <span class="font-medium text-slate-700">Settlement reason</span>
                                        <textarea v-model="settings.afriExchange.notes.settlementReason" rows="4" class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none"></textarea>
                                    </label>
                                    <label class="space-y-1 text-sm">
                                        <span class="font-medium text-slate-700">Operator note</span>
                                        <textarea v-model="settings.afriExchange.notes.operatorNote" rows="3" class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none" placeholder="Optional note for operators, rollout context, or upcoming token changes."></textarea>
                                    </label>
                                </div>
                            </div>
                        </section>

                        <section class="rounded-lg border border-slate-200 p-4">
                            <h4 class="text-base font-semibold text-slate-900">Rail availability</h4>
                            <div class="mt-4 grid gap-3 md:grid-cols-3">
                                <label class="flex items-center gap-3 rounded-md border border-slate-100 px-3 py-2 text-sm">
                                    <input v-model="settings.afriExchange.rails.afriExchangeEnabled" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500">
                                    <span>AfriExchange enabled</span>
                                </label>
                                <label class="flex items-center gap-3 rounded-md border border-slate-100 px-3 py-2 text-sm">
                                    <input v-model="settings.afriExchange.rails.paystackEnabled" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500">
                                    <span>Paystack visible</span>
                                </label>
                                <label class="flex items-center gap-3 rounded-md border border-slate-100 px-3 py-2 text-sm">
                                    <input v-model="settings.afriExchange.rails.opayEnabled" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500">
                                    <span>OPay visible</span>
                                </label>
                            </div>
                        </section>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";
import apiClient from "@/api/axios";

const { t } = useI18n();

const loading = ref(true);
const saving = ref(false);
const currentTab = ref("general");

const tabs = [
    { id: "general", name: "General" },
    { id: "commerce", name: "Commerce" },
    { id: "payouts", name: "Payouts" },
    { id: "shipping", name: "Shipping" },
    { id: "afriexchange", name: "AfriExchange" },
];

const tokenOptions = ["CT", "NT", "USDT"];
const defaultAfriExchangeWebUrl = import.meta.env.VITE_AFRIEXCHANGE_WEB_URL || "https://afri-x.vercel.app/";
const defaultAfriExchangeMerchantId = "04b76353-6d94-419d-9b10-4e84161575c1";
const defaultAfriExchangeWebhookCallbackUrl = "http://localhost:7788/api/afriexchange/webhooks";

const createDefaultSettings = () => ({
    general: {
        platformName: "Kaalis",
        supportEmail: "",
        currency: "NGN",
        timezone: "WAT",
        maintenanceMode: false,
    },
    payment: {
        checkoutPlatformFeePercent: 8,
    },
    payouts: {
        defaultTier: {
            holdingPeriod: 3,
            minimumAmount: 1000,
            batchSize: 100,
            vendorSharePercent: 92,
        },
        premiumTier: {
            holdingPeriod: 1,
            minimumAmount: 500,
            batchSize: 200,
            vendorSharePercent: 95,
        },
        notifications: {
            sendVendorNotifications: true,
            notifyOnFailure: true,
            notifyBeforePayout: true,
            reminderHours: 24,
        },
        retryStrategy: {
            maxAttempts: 3,
            delays: [24, 48, 72],
        },
    },
    shipping: {
        baseCost: 10,
        freeThreshold: 100,
        zones: [],
    },
    afriExchange: {
        linkedMerchantId: defaultAfriExchangeMerchantId,
        linkedMerchantName: "Kaalis Store",
        webAppUrl: defaultAfriExchangeWebUrl,
        webhookCallbackUrl: defaultAfriExchangeWebhookCallbackUrl,
        defaultToken: "CT",
        allowedTokens: ["CT"],
        rails: {
            afriExchangeEnabled: true,
            paystackEnabled: true,
            opayEnabled: true,
        },
        notes: {
            settlementReason: "CT currently solves Kaalis XOF settlement needs.",
            operatorNote: "",
        },
        health: {
            lastWebhookReceivedAt: null,
            lastWebhookEvent: "",
            lastWebhookReference: "",
            lastWebhookStatus: "",
        },
    },
    runtime: {
        integrations: {
            paystack: { enabled: false },
            opay: { enabled: false },
            afriExchange: {
                enabled: false,
                apiBaseUrl: "",
                apiKeyConfigured: false,
                webhookSecretConfigured: false,
            },
        },
        notes: {},
    },
});

const settings = ref(createDefaultSettings());

const paymentRails = computed(() => [
    {
        key: "paystack",
        label: "Paystack",
        description: "Primary NGN checkout rail",
        enabled: Boolean(settings.value.runtime?.integrations?.paystack?.enabled),
    },
    {
        key: "opay",
        label: "OPay",
        description: "Optional NGN checkout rail",
        enabled: Boolean(settings.value.runtime?.integrations?.opay?.enabled),
    },
    {
        key: "afriExchange",
        label: "AfriExchange",
        description: "XOF collection and settlement rail",
        enabled: Boolean(settings.value.runtime?.integrations?.afriExchange?.enabled),
    },
]);

const normalizeSettings = (payload = {}) => ({
    ...createDefaultSettings(),
    ...payload,
    general: {
        ...createDefaultSettings().general,
        ...(payload.general || {}),
    },
    payment: {
        ...createDefaultSettings().payment,
        ...(payload.payment || {}),
    },
    payouts: {
        ...createDefaultSettings().payouts,
        ...(payload.payouts || {}),
        defaultTier: {
            ...createDefaultSettings().payouts.defaultTier,
            ...(payload.payouts?.defaultTier || {}),
        },
        premiumTier: {
            ...createDefaultSettings().payouts.premiumTier,
            ...(payload.payouts?.premiumTier || {}),
        },
        notifications: {
            ...createDefaultSettings().payouts.notifications,
            ...(payload.payouts?.notifications || {}),
        },
        retryStrategy: {
            ...createDefaultSettings().payouts.retryStrategy,
            ...(payload.payouts?.retryStrategy || {}),
        },
    },
    shipping: {
        ...createDefaultSettings().shipping,
        ...(payload.shipping || {}),
        zones: Array.isArray(payload.shipping?.zones) ? payload.shipping.zones : [],
    },
    afriExchange: {
        ...createDefaultSettings().afriExchange,
        ...(payload.afriExchange || {}),
        linkedMerchantId:
            payload.afriExchange?.linkedMerchantId?.trim?.() ||
            createDefaultSettings().afriExchange.linkedMerchantId,
        linkedMerchantName:
            payload.afriExchange?.linkedMerchantName?.trim?.() ||
            createDefaultSettings().afriExchange.linkedMerchantName,
        webAppUrl:
            payload.afriExchange?.webAppUrl?.trim?.() ||
            createDefaultSettings().afriExchange.webAppUrl,
        webhookCallbackUrl:
            payload.afriExchange?.webhookCallbackUrl?.trim?.() ||
            createDefaultSettings().afriExchange.webhookCallbackUrl,
        allowedTokens: Array.isArray(payload.afriExchange?.allowedTokens)
            ? payload.afriExchange.allowedTokens
            : createDefaultSettings().afriExchange.allowedTokens,
        rails: {
            ...createDefaultSettings().afriExchange.rails,
            ...(payload.afriExchange?.rails || {}),
        },
        notes: {
            ...createDefaultSettings().afriExchange.notes,
            ...(payload.afriExchange?.notes || {}),
        },
        health: {
            ...createDefaultSettings().afriExchange.health,
            ...(payload.afriExchange?.health || {}),
        },
    },
    runtime: {
        ...createDefaultSettings().runtime,
        ...(payload.runtime || {}),
        integrations: {
            ...createDefaultSettings().runtime.integrations,
            ...(payload.runtime?.integrations || {}),
            afriExchange: {
                ...createDefaultSettings().runtime.integrations.afriExchange,
                ...(payload.runtime?.integrations?.afriExchange || {}),
            },
        },
    },
});

const afriExchangeStatus = computed(() => {
    const runtime = settings.value.runtime?.integrations?.afriExchange || {};
    const configured = Boolean(runtime.enabled && runtime.apiKeyConfigured && runtime.webhookSecretConfigured);
    const linked = Boolean(settings.value.afriExchange.linkedMerchantId && settings.value.afriExchange.webhookCallbackUrl);

    if (configured && linked) {
        return {
            label: "Connected",
            description: "Runtime secrets and merchant linkage are both in place.",
        };
    }

    if (configured || linked) {
        return {
            label: "Needs attention",
            description: "Some AfriExchange pieces are configured, but the full operator picture is incomplete.",
        };
    }

    return {
        label: "Disabled",
        description: "AfriExchange is not fully configured for this Kaalis environment.",
    };
});

const fetchSettings = async () => {
    loading.value = true;
    try {
        const response = await apiClient.get("/admin/settings");
        settings.value = normalizeSettings(response.data || {});
    } catch (error) {
        console.error("Error fetching settings:", error);
        toast.error(t("adminSettings.toasts.fetchFailed"));
    } finally {
        loading.value = false;
    }
};

const saveSettings = async () => {
    saving.value = true;
    try {
        const payload = {
            general: settings.value.general,
            payment: settings.value.payment,
            payouts: settings.value.payouts,
            shipping: settings.value.shipping,
            afriExchange: settings.value.afriExchange,
        };
        const response = await apiClient.put("/admin/settings", payload);
        settings.value = normalizeSettings(response.data?.settings || settings.value);
        toast.success(t("adminSettings.toasts.saved"));
    } catch (error) {
        console.error("Error saving settings:", error);
        toast.error(error.response?.data?.message || t("adminSettings.toasts.saveFailed"));
    } finally {
        saving.value = false;
    }
};

const addShippingZone = () => {
    settings.value.shipping.zones.push({
        name: "",
        regions: "",
        rate: 0,
    });
};

const removeShippingZone = (index) => {
    settings.value.shipping.zones.splice(index, 1);
};

const toggleAllowedToken = (token) => {
    const allowed = settings.value.afriExchange.allowedTokens;
    const exists = allowed.includes(token);

    if (exists) {
        if (allowed.length === 1) {
            return;
        }

        settings.value.afriExchange.allowedTokens = allowed.filter((item) => item !== token);
        if (settings.value.afriExchange.defaultToken === token) {
            settings.value.afriExchange.defaultToken = settings.value.afriExchange.allowedTokens[0] || "CT";
        }
        return;
    }

    settings.value.afriExchange.allowedTokens = [...allowed, token];
};

const formatAfriExchangeHealthTimestamp = (value) => {
    if (!value) {
        return "No webhook received yet";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "No webhook received yet";
    }

    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
};

onMounted(fetchSettings);
</script>

<template>
    <div class="space-y-6">
        <div class="rounded-lg bg-white px-4 py-5 shadow-sm sm:px-6">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div class="flex items-center gap-3">
                        <h2 class="text-2xl font-bold text-slate-900">{{ t('adminSettings.title') }}</h2>
                        <span v-if="!isSuperAdmin"
                            class="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800">
                            {{ t('adminSettings.readOnly') }}
                        </span>
                    </div>
                    <p class="mt-1 max-w-3xl text-sm text-slate-600">
                        {{ t('adminSettings.subtitle') }}
                    </p>
                </div>
                <button v-if="isSuperAdmin" type="button" @click="saveSettings" :disabled="loading || saving"
                    class="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
                    {{ saving ? t('adminSettings.saving') : t('adminSettings.saveChanges') }}
                </button>
            </div>
            <div v-if="!isSuperAdmin" class="mt-4 rounded-md bg-slate-50 p-3 text-xs text-slate-600">
                {{ t('adminSettings.readOnlyNotice') }}
            </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{
                    t('adminSettings.stats.checkoutFee') }}</p>
                <p class="mt-2 text-2xl font-semibold text-slate-900">{{ settings.payment.checkoutPlatformFeePercent }}%
                </p>
                <p class="mt-1 text-sm text-slate-500">{{ t('adminSettings.stats.checkoutFeeDesc') }}</p>
            </section>
            <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{
                    t('adminSettings.stats.defaultVendorShare') }}</p>
                <p class="mt-2 text-2xl font-semibold text-slate-900">{{ settings.payouts.defaultTier.vendorSharePercent
                    }}%</p>
                <p class="mt-1 text-sm text-slate-500">{{ t('adminSettings.stats.defaultVendorShareDesc') }}</p>
            </section>
            <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{
                    t('adminSettings.stats.premiumVendorShare') }}</p>
                <p class="mt-2 text-2xl font-semibold text-slate-900">{{ settings.payouts.premiumTier.vendorSharePercent
                    }}%</p>
                <p class="mt-1 text-sm text-slate-500">{{ t('adminSettings.stats.premiumVendorShareDesc') }}</p>
            </section>
            <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{
                    t('adminSettings.stats.maintenanceMode') }}</p>
                <p class="mt-2 text-2xl font-semibold text-slate-900">
                    {{ settings.general.maintenanceMode ? t('adminSettings.stats.maintenanceOn') :
                        t('adminSettings.stats.maintenanceOff') }}
                </p>
                <p class="mt-1 text-sm text-slate-500">{{ t('adminSettings.stats.maintenanceModeDesc') }}</p>
            </section>
        </div>

        <div class="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
            <aside class="rounded-lg bg-white p-3 shadow-sm">
                <nav class="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                    <button v-for="tab in tabs" :key="tab.id" type="button" @click="currentTab = tab.id" :class="[
                        'rounded-md px-3 py-2 text-left text-sm font-medium transition',
                        currentTab === tab.id
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-700 hover:bg-slate-100'
                    ]">
                        {{ t('adminSettings.tabs.' + tab.id) }}
                    </button>
                </nav>
            </aside>

            <div class="rounded-lg bg-white p-4 shadow-sm sm:p-6">
                <div v-if="loading" class="py-12 text-center text-sm text-slate-500">
                    {{ t('adminSettings.loading') }}
                </div>

                <template v-else>
                    <div v-if="currentTab === 'general'" class="space-y-6">
                        <section>
                            <h3 class="text-lg font-semibold text-slate-900">{{ t('adminSettings.general.title') }}</h3>
                            <p class="mt-1 text-sm text-slate-500">{{ t('adminSettings.general.subtitle') }}</p>
                        </section>

                        <div class="grid gap-4 md:grid-cols-2">
                            <label class="space-y-1 text-sm">
                                <span class="font-medium text-slate-700">{{ t('adminSettings.general.platformName')
                                    }}</span>
                                <input v-model="settings.general.platformName" :disabled="!isSuperAdmin" type="text"
                                    class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500">
                            </label>
                            <label class="space-y-1 text-sm">
                                <span class="font-medium text-slate-700">{{ t('adminSettings.general.supportEmail')
                                    }}</span>
                                <input v-model="settings.general.supportEmail" :disabled="!isSuperAdmin" type="email"
                                    class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500">
                            </label>
                            <label class="space-y-1 text-sm">
                                <span class="font-medium text-slate-700">{{ t('adminSettings.general.defaultCurrency')
                                    }}</span>
                                <select v-model="settings.general.currency" :disabled="!isSuperAdmin"
                                    class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500">
                                    <option value="NGN">NGN</option>
                                    <option value="XOF">XOF</option>
                                </select>
                            </label>
                            <label class="space-y-1 text-sm">
                                <span class="font-medium text-slate-700">{{ t('adminSettings.general.timezone')
                                    }}</span>
                                <select v-model="settings.general.timezone" :disabled="!isSuperAdmin"
                                    class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500">
                                    <option value="WAT">WAT</option>
                                    <option value="UTC">UTC</option>
                                    <option value="GMT">GMT</option>
                                </select>
                            </label>
                        </div>

                        <label
                            class="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
                            <input v-model="settings.general.maintenanceMode" :disabled="!isSuperAdmin" type="checkbox"
                                class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500 disabled:opacity-60">
                            <span>
                                <span class="block font-medium text-slate-800">{{
                                    t('adminSettings.general.maintenanceMode') }}</span>
                                <span class="block text-slate-500">{{ t('adminSettings.general.maintenanceModeDesc')
                                    }}</span>
                            </span>
                        </label>
                    </div>

                    <div v-else-if="currentTab === 'commerce'" class="space-y-6">
                        <section>
                            <h3 class="text-lg font-semibold text-slate-900">{{ t('adminSettings.commerce.title') }}
                            </h3>
                            <p class="mt-1 text-sm text-slate-500">
                                {{ t('adminSettings.commerce.subtitle') }}
                            </p>
                        </section>

                        <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
                            <div class="space-y-4">
                                <div class="rounded-lg border border-slate-200 p-4">
                                    <label class="space-y-1 text-sm block">
                                        <span class="font-medium text-slate-700">{{
                                            t('adminSettings.commerce.checkoutFeeLabel') }}</span>
                                        <input v-model.number="settings.payment.checkoutPlatformFeePercent"
                                            :disabled="!isSuperAdmin" type="number" min="0" max="100" step="0.1"
                                            class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500">
                                    </label>
                                    <div class="mt-3 rounded-md bg-amber-50 p-3 text-sm text-amber-900">
                                        <p class="font-medium">{{ t('adminSettings.commerce.sourceOfTruth') }}</p>
                                        <p class="mt-1">
                                            {{ t('adminSettings.commerce.sourceOfTruthDesc') }}
                                        </p>
                                    </div>
                                </div>

                                <div v-if="settings.currencyConversion" class="rounded-lg border border-slate-200 p-4">
                                    <h4 class="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-4">{{
                                        t('adminSettings.commerce.exchangeRatesTitle') }}</h4>
                                    <div class="space-y-4">
                                        <label class="space-y-1 text-sm block">
                                            <span class="font-medium text-slate-700">{{
                                                t('adminSettings.commerce.ngnToXofLabel') }}</span>
                                            <input v-model.number="settings.currencyConversion.ngnToXofRate"
                                                :disabled="!isSuperAdmin" type="number" min="0" step="0.0001"
                                                class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500">
                                        </label>
                                        <label class="space-y-1 text-sm block">
                                            <span class="font-medium text-slate-700">{{
                                                t('adminSettings.commerce.xofToNgnLabel') }}</span>
                                            <input v-model.number="settings.currencyConversion.xofToNgnRate"
                                                :disabled="!isSuperAdmin" type="number" min="0" step="0.0001"
                                                class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500">
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="rounded-lg border border-slate-200 p-4">
                                <h4 class="text-sm font-semibold uppercase tracking-wide text-slate-500">{{
                                    t('adminSettings.commerce.paymentRails') }}</h4>
                                <div class="mt-4 space-y-3">
                                    <div v-for="rail in paymentRails" :key="rail.key"
                                        class="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2">
                                        <div>
                                            <p class="text-sm font-medium text-slate-800">{{ rail.label }}</p>
                                            <p class="text-xs text-slate-500">{{ rail.description }}</p>
                                        </div>
                                        <span
                                            :class="rail.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'"
                                            class="rounded-full px-2.5 py-1 text-xs font-semibold">
                                            {{ rail.enabled ? t('adminSettings.commerce.configured') :
                                                t('adminSettings.commerce.unavailable') }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-else-if="currentTab === 'payouts'" class="space-y-6">
                        <section>
                            <h3 class="text-lg font-semibold text-slate-900">{{ t('adminSettings.payouts.title') }}</h3>
                            <p class="mt-1 text-sm text-slate-500">{{ t('adminSettings.payouts.subtitle') }}</p>
                        </section>

                        <div class="grid gap-6 xl:grid-cols-2">
                            <section class="rounded-lg border border-slate-200 p-4">
                                <h4 class="text-base font-semibold text-slate-900">{{
                                    t('adminSettings.payouts.defaultTier') }}</h4>
                                <div class="mt-4 grid gap-4 sm:grid-cols-2">
                                    <label class="space-y-1 text-sm">
                                        <span class="font-medium text-slate-700">{{
                                            t('adminSettings.payouts.vendorShare') }}</span>
                                        <input v-model.number="settings.payouts.defaultTier.vendorSharePercent"
                                            :disabled="!isSuperAdmin" type="number" min="0" max="100"
                                            class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500">
                                    </label>
                                    <label class="space-y-1 text-sm">
                                        <span class="font-medium text-slate-700">{{
                                            t('adminSettings.payouts.holdingPeriod') }}</span>
                                        <input v-model.number="settings.payouts.defaultTier.holdingPeriod"
                                            :disabled="!isSuperAdmin" type="number" min="0"
                                            class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500">
                                    </label>
                                    <label class="space-y-1 text-sm">
                                        <span class="font-medium text-slate-700">{{
                                            t('adminSettings.payouts.minimumPayout') }}</span>
                                        <input v-model.number="settings.payouts.defaultTier.minimumAmount"
                                            :disabled="!isSuperAdmin" type="number" min="0"
                                            class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500">
                                    </label>
                                    <label class="space-y-1 text-sm">
                                        <span class="font-medium text-slate-700">{{ t('adminSettings.payouts.batchSize')
                                            }}</span>
                                        <input v-model.number="settings.payouts.defaultTier.batchSize"
                                            :disabled="!isSuperAdmin" type="number" min="1"
                                            class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500">
                                    </label>
                                </div>
                            </section>

                            <section class="rounded-lg border border-slate-200 p-4">
                                <h4 class="text-base font-semibold text-slate-900">{{
                                    t('adminSettings.payouts.premiumTier') }}</h4>
                                <div class="mt-4 grid gap-4 sm:grid-cols-2">
                                    <label class="space-y-1 text-sm">
                                        <span class="font-medium text-slate-700">{{
                                            t('adminSettings.payouts.vendorShare') }}</span>
                                        <input v-model.number="settings.payouts.premiumTier.vendorSharePercent"
                                            :disabled="!isSuperAdmin" type="number" min="0" max="100"
                                            class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500">
                                    </label>
                                    <label class="space-y-1 text-sm">
                                        <span class="font-medium text-slate-700">{{
                                            t('adminSettings.payouts.holdingPeriod') }}</span>
                                        <input v-model.number="settings.payouts.premiumTier.holdingPeriod"
                                            :disabled="!isSuperAdmin" type="number" min="0"
                                            class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500">
                                    </label>
                                    <label class="space-y-1 text-sm">
                                        <span class="font-medium text-slate-700">{{
                                            t('adminSettings.payouts.minimumPayout') }}</span>
                                        <input v-model.number="settings.payouts.premiumTier.minimumAmount"
                                            :disabled="!isSuperAdmin" type="number" min="0"
                                            class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500">
                                    </label>
                                    <label class="space-y-1 text-sm">
                                        <span class="font-medium text-slate-700">{{ t('adminSettings.payouts.batchSize')
                                            }}</span>
                                        <input v-model.number="settings.payouts.premiumTier.batchSize"
                                            :disabled="!isSuperAdmin" type="number" min="1"
                                            class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500">
                                    </label>
                                </div>
                            </section>
                        </div>

                        <section class="rounded-lg border border-slate-200 p-4">
                            <h4 class="text-base font-semibold text-slate-900">{{
                                t('adminSettings.payouts.retryAndNotifications') }}</h4>
                            <div class="mt-4 grid gap-4 lg:grid-cols-2">
                                <label class="space-y-1 text-sm">
                                    <span class="font-medium text-slate-700">{{
                                        t('adminSettings.payouts.maxRetryAttempts') }}</span>
                                    <input v-model.number="settings.payouts.retryStrategy.maxAttempts"
                                        :disabled="!isSuperAdmin" type="number" min="0"
                                        class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500">
                                </label>
                                <label class="space-y-1 text-sm">
                                    <span class="font-medium text-slate-700">{{ t('adminSettings.payouts.reminderHours')
                                        }}</span>
                                    <input v-model.number="settings.payouts.notifications.reminderHours"
                                        :disabled="!isSuperAdmin" type="number" min="0"
                                        class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500">
                                </label>
                            </div>
                            <div class="mt-4 grid gap-3 md:grid-cols-3">
                                <label
                                    class="flex items-center gap-3 rounded-md border border-slate-100 px-3 py-2 text-sm">
                                    <input v-model="settings.payouts.notifications.sendVendorNotifications"
                                        :disabled="!isSuperAdmin" type="checkbox"
                                        class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500 disabled:opacity-60">
                                    <span>{{ t('adminSettings.payouts.notifyVendors') }}</span>
                                </label>
                                <label
                                    class="flex items-center gap-3 rounded-md border border-slate-100 px-3 py-2 text-sm">
                                    <input v-model="settings.payouts.notifications.notifyOnFailure"
                                        :disabled="!isSuperAdmin" type="checkbox"
                                        class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500 disabled:opacity-60">
                                    <span>{{ t('adminSettings.payouts.notifyOnFailure') }}</span>
                                </label>
                                <label
                                    class="flex items-center gap-3 rounded-md border border-slate-100 px-3 py-2 text-sm">
                                    <input v-model="settings.payouts.notifications.notifyBeforePayout"
                                        :disabled="!isSuperAdmin" type="checkbox"
                                        class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500 disabled:opacity-60">
                                    <span>{{ t('adminSettings.payouts.notifyBeforePayout') }}</span>
                                </label>
                            </div>
                        </section>
                    </div>

                    <div v-else-if="currentTab === 'shipping'" class="space-y-6">
                        <section>
                            <h3 class="text-lg font-semibold text-slate-900">{{ t('adminSettings.shipping.title') }}
                            </h3>
                            <p class="mt-1 text-sm text-slate-500">{{ t('adminSettings.shipping.subtitle') }}</p>
                        </section>

                        <div class="grid gap-4 md:grid-cols-2">
                            <label class="space-y-1 text-sm">
                                <span class="font-medium text-slate-700">{{ t('adminSettings.shipping.baseCost')
                                    }}</span>
                                <input v-model.number="settings.shipping.baseCost" :disabled="!isSuperAdmin"
                                    type="number" min="0"
                                    class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500">
                            </label>
                            <label class="space-y-1 text-sm">
                                <span class="font-medium text-slate-700">{{ t('adminSettings.shipping.freeThreshold')
                                    }}</span>
                                <input v-model.number="settings.shipping.freeThreshold" :disabled="!isSuperAdmin"
                                    type="number" min="0"
                                    class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500">
                            </label>
                        </div>

                        <section class="rounded-lg border border-slate-200 p-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h4 class="text-base font-semibold text-slate-900">{{
                                        t('adminSettings.shipping.shippingZones') }}</h4>
                                    <p class="text-sm text-slate-500">{{ t('adminSettings.shipping.shippingZonesDesc')
                                        }}</p>
                                </div>
                                <button v-if="isSuperAdmin" type="button" @click="addShippingZone"
                                    class="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                                    {{ t('adminSettings.shipping.addZone') }}
                                </button>
                            </div>

                            <div class="mt-4 space-y-4">
                                <div v-if="!settings.shipping.zones.length"
                                    class="rounded-md border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                                    {{ t('adminSettings.shipping.noZones') }}
                                </div>
                                <div v-for="(zone, index) in settings.shipping.zones" :key="index"
                                    class="rounded-lg border border-slate-100 p-4">
                                    <div class="grid gap-4 lg:grid-cols-[1fr_1.2fr_180px]">
                                        <label class="space-y-1 text-sm">
                                            <span class="font-medium text-slate-700">{{
                                                t('adminSettings.shipping.zoneName') }}</span>
                                            <input v-model="zone.name" :disabled="!isSuperAdmin" type="text"
                                                class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500">
                                        </label>
                                        <label class="space-y-1 text-sm">
                                            <span class="font-medium text-slate-700">{{
                                                t('adminSettings.shipping.regions') }}</span>
                                            <input v-model="zone.regions" :disabled="!isSuperAdmin" type="text"
                                                class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
                                                :placeholder="t('adminSettings.shipping.regionsPlaceholder')">
                                        </label>
                                        <label class="space-y-1 text-sm">
                                            <span class="font-medium text-slate-700">{{ t('adminSettings.shipping.rate')
                                                }}</span>
                                            <input v-model.number="zone.rate" :disabled="!isSuperAdmin" type="number"
                                                min="0"
                                                class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500">
                                        </label>
                                    </div>
                                    <div v-if="isSuperAdmin" class="mt-3 flex justify-end">
                                        <button type="button" @click="removeShippingZone(index)"
                                            class="text-sm font-medium text-rose-600 hover:text-rose-700">
                                            {{ t('adminSettings.shipping.removeZone') }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div v-else-if="currentTab === 'afriexchange'" class="space-y-6">
                        <section>
                            <h3 class="text-lg font-semibold text-slate-900">{{ t('adminSettings.afriexchange.title') }}
                            </h3>
                            <p class="mt-1 text-sm text-slate-500">
                                {{ t('adminSettings.afriexchange.subtitle') }}
                            </p>
                        </section>

                        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <section class="rounded-lg border border-slate-200 p-4">
                                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{
                                    t('adminSettings.afriexchange.integrationStatus') }}</p>
                                <p class="mt-2 text-2xl font-semibold text-slate-900">{{ afriExchangeStatus.label }}</p>
                                <p class="mt-1 text-sm text-slate-500">{{ afriExchangeStatus.description }}</p>
                            </section>
                            <section class="rounded-lg border border-slate-200 p-4">
                                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{
                                    t('adminSettings.afriexchange.linkedMerchant') }}</p>
                                <p class="mt-2 text-lg font-semibold text-slate-900">{{
                                    settings.afriExchange.linkedMerchantName || t('adminSettings.afriexchange.notSet')
                                    }}</p>
                                <p class="mt-1 break-all font-mono text-xs text-slate-500">{{
                                    settings.afriExchange.linkedMerchantId ||
                                    t('adminSettings.afriexchange.merchantIdMissing') }}</p>
                            </section>
                            <section class="rounded-lg border border-slate-200 p-4">
                                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{
                                    t('adminSettings.afriexchange.defaultToken') }}</p>
                                <p class="mt-2 text-2xl font-semibold text-slate-900">{{
                                    settings.afriExchange.defaultToken }}</p>
                                <p class="mt-1 text-sm text-slate-500">{{
                                    t('adminSettings.afriexchange.defaultTokenDesc') }}</p>
                            </section>
                            <section class="rounded-lg border border-slate-200 p-4">
                                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{
                                    t('adminSettings.afriexchange.webhookSecret') }}</p>
                                <p class="mt-2 text-2xl font-semibold text-slate-900">
                                    {{ settings.runtime?.integrations?.afriExchange?.webhookSecretConfigured ?
                                        t('adminSettings.afriexchange.configuredInEnv') :
                                        t('adminSettings.afriexchange.missingFromEnv') }}
                                </p>
                                <p class="mt-1 text-sm text-slate-500">{{
                                    t('adminSettings.afriexchange.webhookSecretDesc') }}</p>
                            </section>
                            <section class="rounded-lg border border-slate-200 p-4">
                                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{
                                    t('adminSettings.afriexchange.lastWebhookReceived') }}</p>
                                <p class="mt-2 text-sm font-semibold text-slate-900">
                                    {{
                                        formatAfriExchangeHealthTimestamp(settings.afriExchange.health?.lastWebhookReceivedAt)
                                    }}
                                </p>
                                <p class="mt-1 text-xs text-slate-500">
                                    {{ settings.afriExchange.health?.lastWebhookEvent ||
                                        t('adminSettings.afriexchange.noWebhookYet') }}
                                </p>
                            </section>
                        </div>

                        <div class="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                            <section class="rounded-lg border border-slate-200 p-4">
                                <h4 class="text-base font-semibold text-slate-900">{{
                                    t('adminSettings.afriexchange.connectionConfig') }}</h4>
                                <div class="mt-4 grid gap-4 md:grid-cols-2">
                                    <label class="space-y-1 text-sm md:col-span-2">
                                        <span class="font-medium text-slate-700">{{
                                            t('adminSettings.afriexchange.apiBaseUrl') }}</span>
                                        <input :value="settings.runtime?.integrations?.afriExchange?.apiBaseUrl || ''"
                                            type="text" disabled
                                            class="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-slate-600 shadow-sm">
                                    </label>
                                    <label class="space-y-1 text-sm md:col-span-2">
                                        <span class="font-medium text-slate-700">{{
                                            t('adminSettings.afriexchange.webAppUrl') }}</span>
                                        <input v-model="settings.afriExchange.webAppUrl" :disabled="!isSuperAdmin"
                                            type="text"
                                            class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
                                            :placeholder="defaultAfriExchangeWebUrl">
                                    </label>
                                    <label class="space-y-1 text-sm">
                                        <span class="font-medium text-slate-700">{{
                                            t('adminSettings.afriexchange.linkedMerchantName') }}</span>
                                        <input v-model="settings.afriExchange.linkedMerchantName"
                                            :disabled="!isSuperAdmin" type="text"
                                            class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500">
                                    </label>
                                    <label class="space-y-1 text-sm">
                                        <span class="font-medium text-slate-700">{{
                                            t('adminSettings.afriexchange.linkedMerchantId') }}</span>
                                        <input v-model="settings.afriExchange.linkedMerchantId"
                                            :disabled="!isSuperAdmin" type="text"
                                            class="w-full rounded-md border border-slate-200 px-3 py-2 font-mono text-xs shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500">
                                    </label>
                                    <label class="space-y-1 text-sm md:col-span-2">
                                        <span class="font-medium text-slate-700">{{
                                            t('adminSettings.afriexchange.webhookCallbackUrl') }}</span>
                                        <input v-model="settings.afriExchange.webhookCallbackUrl"
                                            :disabled="!isSuperAdmin" type="text"
                                            class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
                                            :placeholder="defaultAfriExchangeWebhookCallbackUrl">
                                    </label>
                                </div>
                            </section>

                            <section class="rounded-lg border border-slate-200 p-4">
                                <h4 class="text-base font-semibold text-slate-900">{{
                                    t('adminSettings.afriexchange.runtimeAndSecrets') }}</h4>
                                <div class="mt-4 space-y-3">
                                    <div class="rounded-md border border-slate-100 px-3 py-2">
                                        <p class="text-sm font-medium text-slate-800">{{
                                            t('adminSettings.afriexchange.apiKey') }}</p>
                                        <p class="mt-1 text-sm text-slate-500">
                                            {{ settings.runtime?.integrations?.afriExchange?.apiKeyConfigured ?
                                                t('adminSettings.afriexchange.configuredInEnv') :
                                                t('adminSettings.afriexchange.missingFromEnv') }}
                                        </p>
                                    </div>
                                    <div class="rounded-md border border-slate-100 px-3 py-2">
                                        <p class="text-sm font-medium text-slate-800">{{
                                            t('adminSettings.afriexchange.webhookSecret') }}</p>
                                        <p class="mt-1 text-sm text-slate-500">
                                            {{ settings.runtime?.integrations?.afriExchange?.webhookSecretConfigured ?
                                                t('adminSettings.afriexchange.configuredInEnv') :
                                                t('adminSettings.afriexchange.missingFromEnv') }}
                                        </p>
                                    </div>
                                    <div class="rounded-md border border-slate-100 px-3 py-2">
                                        <p class="text-sm font-medium text-slate-800">{{
                                            t('adminSettings.afriexchange.operatorNote') }}</p>
                                        <p class="mt-1 text-sm text-slate-500">
                                            {{ settings.runtime?.notes?.afriExchange ||
                                                'AfriExchange runtime note unavailable.' }}
                                        </p>
                                    </div>
                                    <div class="rounded-md border border-slate-100 px-3 py-2">
                                        <p class="text-sm font-medium text-slate-800">{{
                                            t('adminSettings.afriexchange.webhookHealth') }}</p>
                                        <p class="mt-1 text-sm text-slate-500">
                                            {{ t('adminSettings.afriexchange.webhookHealthStatus') }}: {{
                                                settings.afriExchange.health?.lastWebhookStatus ||
                                                t('adminSettings.afriexchange.noWebhookStatus') }}
                                        </p>
                                        <p class="mt-1 break-all text-xs text-slate-400">
                                            {{ t('adminSettings.afriexchange.webhookHealthRef') }}: {{
                                                settings.afriExchange.health?.lastWebhookReference ||
                                                t('adminSettings.afriexchange.noWebhookRef') }}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <section class="rounded-lg border border-slate-200 p-4">
                            <h4 class="text-base font-semibold text-slate-900">{{
                                t('adminSettings.afriexchange.tokenStrategy') }}</h4>
                            <div class="mt-4 grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                                <div class="space-y-4">
                                    <label class="space-y-1 text-sm">
                                        <span class="font-medium text-slate-700">{{
                                            t('adminSettings.afriexchange.defaultTokenLabel') }}</span>
                                        <select v-model="settings.afriExchange.defaultToken" :disabled="!isSuperAdmin"
                                            class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500">
                                            <option value="CT">CT</option>
                                            <option value="NT">NT</option>
                                            <option value="USDT">USDT</option>
                                        </select>
                                    </label>

                                    <div class="space-y-2 text-sm">
                                        <span class="font-medium text-slate-700">{{
                                            t('adminSettings.afriexchange.allowedTokens') }}</span>
                                        <div class="grid gap-2 sm:grid-cols-3">
                                            <label v-for="token in tokenOptions" :key="token"
                                                class="flex items-center gap-3 rounded-md border border-slate-100 px-3 py-2">
                                                <input :checked="settings.afriExchange.allowedTokens.includes(token)"
                                                    :disabled="!isSuperAdmin" type="checkbox"
                                                    class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500 disabled:opacity-60"
                                                    @change="toggleAllowedToken(token)">
                                                <span>{{ token }}</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div class="space-y-4">
                                    <label class="space-y-1 text-sm">
                                        <span class="font-medium text-slate-700">{{
                                            t('adminSettings.afriexchange.settlementReason') }}</span>
                                        <textarea v-model="settings.afriExchange.notes.settlementReason"
                                            :disabled="!isSuperAdmin" rows="4"
                                            class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"></textarea>
                                    </label>
                                    <label class="space-y-1 text-sm">
                                        <span class="font-medium text-slate-700">{{
                                            t('adminSettings.afriexchange.operatorNoteLabel') }}</span>
                                        <textarea v-model="settings.afriExchange.notes.operatorNote"
                                            :disabled="!isSuperAdmin" rows="3"
                                            class="w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
                                            :placeholder="t('adminSettings.afriexchange.operatorNotePlaceholder')"></textarea>
                                    </label>
                                </div>
                            </div>
                        </section>

                        <section class="rounded-lg border border-slate-200 p-4">
                            <h4 class="text-base font-semibold text-slate-900">{{
                                t('adminSettings.afriexchange.railAvailability') }}</h4>
                            <div class="mt-4 grid gap-3 md:grid-cols-3">
                                <label
                                    class="flex items-center gap-3 rounded-md border border-slate-100 px-3 py-2 text-sm">
                                    <input v-model="settings.afriExchange.rails.afriExchangeEnabled"
                                        :disabled="!isSuperAdmin" type="checkbox"
                                        class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500 disabled:opacity-60">
                                    <span>{{ t('adminSettings.afriexchange.afriexchangeEnabled') }}</span>
                                </label>
                                <label
                                    class="flex items-center gap-3 rounded-md border border-slate-100 px-3 py-2 text-sm">
                                    <input v-model="settings.afriExchange.rails.paystackEnabled"
                                        :disabled="!isSuperAdmin" type="checkbox"
                                        class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500 disabled:opacity-60">
                                    <span>{{ t('adminSettings.afriexchange.paystackVisible') }}</span>
                                </label>
                                <label
                                    class="flex items-center gap-3 rounded-md border border-slate-100 px-3 py-2 text-sm">
                                    <input v-model="settings.afriExchange.rails.opayEnabled" :disabled="!isSuperAdmin"
                                        type="checkbox"
                                        class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500 disabled:opacity-60">
                                    <span>{{ t('adminSettings.afriexchange.opayVisible') }}</span>
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
import { useAdminStore } from "@/store/admin";

const { t } = useI18n();
const adminStore = useAdminStore();

const loading = ref(true);
const saving = ref(false);
const currentTab = ref("general");

const isSuperAdmin = computed(() => adminStore.adminUser?.role === "SuperAdmin");

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
    currencyConversion: {
        ngnToXofRate: 0.42,
        xofToNgnRate: 2.38,
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
    currencyConversion: {
        ...createDefaultSettings().currencyConversion,
        ...(payload.currencyConversion || {}),
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
            label: t("adminSettings.afriexchange.statusConnected"),
            description: t("adminSettings.afriexchange.statusConnectedDesc"),
        };
    }

    if (configured || linked) {
        return {
            label: t("adminSettings.afriexchange.statusNeedsAttention"),
            description: t("adminSettings.afriexchange.statusNeedsAttentionDesc"),
        };
    }

    return {
        label: t("adminSettings.afriexchange.statusDisabled"),
        description: t("adminSettings.afriexchange.statusDisabledDesc"),
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
            currencyConversion: settings.value.currencyConversion,
            payment: settings.value.payment,
            payouts: settings.value.payouts,
            shipping: settings.value.shipping,
            afriExchange: settings.value.afriExchange,
        };
        const response = await apiClient.put("/admin/settings", payload);
        const normalized = normalizeSettings(response.data?.settings || settings.value);
        settings.value = normalized;
        localStorage.setItem("kaalisPlatformRuntimeSettings", JSON.stringify({
            general: normalized.general,
            currencyConversion: normalized.currencyConversion,
            payment: normalized.payment,
            runtime: normalized.runtime
        }));
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
        return t("adminSettings.afriexchange.noWebhookReceivedYet");
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return t("adminSettings.afriexchange.noWebhookReceivedYet");
    }

    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
};

onMounted(fetchSettings);
</script>

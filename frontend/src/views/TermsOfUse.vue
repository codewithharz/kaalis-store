<template>
    <div class="bg-gray-100 min-h-screen">
        <div class="container mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold mb-8">Terms of Use</h1>

            <div class="grid grid-cols-1 md:grid-cols-4">
                <!-- Left sidebar -->
                <div class="col-span-1 w-[90%]">
                    <SidebarNavigation />
                </div>

                <!-- Main content -->
                <div class="col-span-1 md:col-span-3    ">
                    <h2 class="text-2xl font-semibold mb-4 border px-3 py-1 rounded-md border-gray-300">Terms of Use
                    </h2>

                    <div class="space-y-6 border px-3 py-1 rounded-md border-gray-300">
                        <p class="mb-4">Entering this website or using any information on this website means that you
                            accept
                            the following conditions.</p>

                        <div>
                            <p>DSM Group Consulting Communication and Sales Trade Inc. is not responsible for any direct
                                or indirect damages that may arise due to breach of contract, tort, or other reasons due
                                to entering this website, using the site or the information and other data programs etc.
                                DSM GRUP does not accept any responsibility for interruption of the transaction, error,
                                negligence, interruption due to breach of contract, tort, negligence or other reasons.
                            </p>
                        </div>

                        <div>
                            <p>DSM GRUP reserves the right to change any services, products, site usage conditions and
                                information provided on this site and its extensions without prior notice, to reorganize
                                the site, and to cease publication. Changes shall enter into force at the time of
                                publication on the site. These changes shall be deemed to be accepted by using or
                                logging into the site. These conditions shall also apply to other web pages to which
                                links are provided.</p>
                        </div>

                        <div>
                            <p>DSM GRUP does not accept any responsibility for interruption of the transaction, error,
                                negligence, interruption, deletion, loss, delay of transaction or communication,
                                computer virus, communication error, theft, destruction or unauthorized entry into,
                                alteration or use of records, as a result of breach of contract, tort, negligence or
                                other reasons.</p>
                        </div>

                        <div>
                            <p>This website may contain links or references to other websites that are not under the
                                control of DSM GRUP. DSM GRUP is not responsible for the content of these sites or other
                                links they contain.</p>
                        </div>

                        <div>
                            <p>DSM GRUP is the owner or licensee of the general appearance and design of this website
                                and all information, pictures, Bruthol brand and other brands on the website,
                                www.bruthol.com domain name, logo, icon, technical data presented in demonstrative,
                                written, electronic, graphic or machine-readable form, computer software, applied sales
                                system, business method and business model ("Materials") and all related intellectual
                                and industrial property rights and are under legal protection. No Material on the
                                website; including code and software, may be changed, copied, reproduced, translated
                                into another language, republished, uploaded to another computer, mailed, transmitted,
                                presented or distributed without prior permission and without citing the source. The
                                whole or part of the website may not be used on another website without permission.
                                Acting to the contrary requires legal and criminal liability. All other rights of DSM
                                GRUP not expressly stated herein are reserved.</p>
                        </div>

                        <div>
                            <p>DSM GRUP reserves the right to update the content of this legal notice page at any time
                                and recommends its users to visit the legal notice page every time they enter the site.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SidebarNavigation from './pages/components/community/SidebarNavigation.vue'

export default {
    name: 'TermsOfUsePage',
    // Add any necessary component logic here

    components: {
        SidebarNavigation
    }
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
<template>
    <div class="ml-2 inline-flex flex-col">
        <ArrowUp :class="[
            'w-3 h-3',
            {
                'text-amber-500': sortKey === field && sortOrder === 'asc',
                'text-gray-300': sortKey !== field || sortOrder !== 'asc'
            }
        ]" />
        <ArrowDown :class="[
            'w-3 h-3 -mt-1',
            {
                'text-amber-500': sortKey === field && sortOrder === 'desc',
                'text-gray-300': sortKey !== field || sortOrder !== 'desc'
            }
        ]" />
    </div>
</template>

<script>
import { ArrowUp, ArrowDown } from 'lucide-vue-next';

export default {
    name: 'SortIcon',
    components: {
        ArrowUp,
        ArrowDown
    },
    props: {
        sortKey: {
            type: String,
            required: true
        },
        sortOrder: {
            type: String,
            required: true,
            validator: (value) => ['asc', 'desc'].includes(value)
        },
        field: {
            type: String,
            required: true
        }
    }
};
</script>
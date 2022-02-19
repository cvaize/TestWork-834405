<template>
  <AppLayout :error-http-code="errorHttpCode">
    <template v-slot:error>
      <div class="container">
        <breadcrumbs-list>
          <breadcrumb-item>
            <router-link to="/"> Главная </router-link>
          </breadcrumb-item>
          <breadcrumb-item>
            <router-link to="/catalog"> Каталог </router-link>
          </breadcrumb-item>
          <breadcrumb-item active> Не найденная программа </breadcrumb-item>
        </breadcrumbs-list>
        <div class="text-2xl py-4 text-center">
          <h1 v-if="errorHttpCode === 404">Программа не найдена</h1>
          <h1 v-else-if="errorHttpCode === 500">Ошибка сервера!</h1>
          <h1 v-else>Ошибка с кодом {{ errorHttpCode }}</h1>
        </div>
      </div>
    </template>
    <div class="container">
      <breadcrumbs-list>
        <breadcrumb-item>
          <router-link to="/"> Главная </router-link>
        </breadcrumb-item>
        <breadcrumb-item>
          <router-link to="/catalog"> Каталог </router-link>
        </breadcrumb-item>
        <breadcrumb-item active> Программа </breadcrumb-item>
      </breadcrumbs-list>
      <div class="flex flex-wrap -mx-4">
        <div class="px-4 w-full xs:max-w-[300px] mb-4">
          <div class="relative before:block before:pt-[100%]">
            <img
              class="absolute inset-0 w-full h-full object-center object-cover rounded-lg"
              src="../../assets/product.jpg"
              alt="Программа"
            />
          </div>
        </div>
        <div class="px-4 w-full xs:max-w-[calc(100%-300px)]">
          <div class="max-w-[600px]">
            <h1 class="text-xl font-bold">{{ product?.name }}</h1>
            <h3 class="mb-4 text-sm">
              <span class="opacity-50">Категория:</span>
              {{ product?.category.name }}
            </h3>
            <div class="opacity-80 text-sm">
              {{ product?.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import AppLayout from "@/layouts/App.vue";
import BreadcrumbsList from "@/components/Breadcrumbs/List.vue";
import BreadcrumbItem from "@/components/Breadcrumbs/Item.vue";
import { useRoute } from "vue-router";
import jsonapi from "@/api/jsonapi";
import {
  v1JsonapiTypes,
  v1Product,
  v1ProductAttributes,
  v1ProductRelations,
  v1ProductTransferEntity,
} from "@/typings/v1-jsonapi";
import { JsonapiOneTransfer } from "@/typings/app";

const route = useRoute();

// eslint-disable-next-line @typescript-eslint/no-empty-function
let abort = () => {};

let product = ref<v1Product | null>(null);
let loading = ref<boolean>(true);
let errorHttpCode = ref<number>(0);

const loadProduct = async () => {
  abort();
  loading.value = true;
  let request = jsonapi.fetchOne<v1ProductTransferEntity>(
    v1JsonapiTypes.Product,
    String(route.params.id),
    {
      include: [v1ProductRelations.category].join(","),
      fields: {
        [v1JsonapiTypes.Product]: [
          v1ProductAttributes.name,
          v1ProductAttributes.description,
          v1ProductAttributes.ordering,
          v1ProductAttributes.category,
          v1ProductAttributes.price,
        ].join(","),
      },
    }
  );
  abort = request.abort;
  try {
    let productTransferEntity: JsonapiOneTransfer<v1ProductTransferEntity> =
      await request.start();

    product.value = await jsonapi.deserializeOne<
      v1ProductTransferEntity,
      v1Product
    >(productTransferEntity);
    console.log("product", product);
  } catch (e: any) {
    errorHttpCode.value = e.status || 500;
    console.error(e);
  }

  if (product.value) {
    document.title =
      product.value.name + " - Программа медицинского образования";
  }

  loading.value = false;
};

loadProduct();

console.log(route.params.id);

onMounted(() => {
  document.title = "Программа медицинского образования";
});
onBeforeUnmount(() => {
  abort();
});
</script>

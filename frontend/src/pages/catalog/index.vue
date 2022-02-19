<template>
  <AppLayout :error-http-code="errorHttpCode">
    <template v-slot:error>
      <div class="container">
        <breadcrumbs-list>
          <breadcrumb-item>
            <router-link to="/"> Главная </router-link>
          </breadcrumb-item>
          <breadcrumb-item active> Каталог </breadcrumb-item>
        </breadcrumbs-list>
        <div class="text-2xl py-4 text-center">
          <h1 v-if="errorHttpCode === 404">Страница не найдена!</h1>
          <h1 v-else-if="errorHttpCode === 500">Ошибка сервера!</h1>
          <h1 v-else>Ошибка с кодом {{ errorHttpCode }}</h1>
        </div>
      </div>
    </template>
    <div class="container">
      <h1 class="text-xl mb-4 hidden">Каталог</h1>
      <breadcrumbs-list>
        <breadcrumb-item>
          <router-link to="/"> Главная </router-link>
        </breadcrumb-item>
        <breadcrumb-item active> Каталог </breadcrumb-item>
      </breadcrumbs-list>
      <div class="flex flex-wrap -mx-4">
        <div class="px-4 w-full sm:max-w-[300px] mb-4">
          <div class="bg-white rounded-lg">
            <div class="bg-blueberry text-center text-white rounded-t-lg p-4">
              {{ Object.keys(store.getters.cart).length }}
              {{
                pluralize(Object.keys(store.getters.cart).length, [
                  "программа",
                  "программы",
                  "программ",
                ])
              }}
              -
              {{
                Object.keys(store.getters.cart)
                  .reduce(
                    (total, productId) =>
                      total + store.getters.cart[productId].price,
                    0
                  )
                  .toLocaleString("ru-RU")
              }}
              ₽
            </div>
            <div class="p-4">
              <div class="mb-2">Программы НМО</div>
              <btn-group>
                <FieldInput
                  :value="search"
                  class="rounded-r-none"
                  placeholder="Поиск"
                  @input="search = $event.target.value"
                  @change="
                    search = $event.target.value;
                    loadProducts();
                  "
                  @keydown="$event.key === 'Enter' && loadProducts()"
                />
                <btn
                  color="auro-metal-saurus-black-coral"
                  @click="loadProducts()"
                >
                  <SearchIcon />
                </btn>
              </btn-group>
            </div>
          </div>
          <div class="bg-white rounded-lg mt-4 p-4">
            <div class="mb-2 font-bold">Категории</div>
            <btn
              class="block w-full text-left rounded-b-none rounded-t"
              :class="`${
                selectedCategoryId !== ''
                  ? 'bg-white text-auro-metal-saurus'
                  : ''
              }`"
              color="auro-metal-saurus-black-coral"
              @click="
                selectedCategoryId = '';
                loadProducts();
              "
            >
              Все категории
            </btn>
            <btn
              v-for="(category, index) in categories"
              :key="category.id"
              class="block w-full text-left rounded-none mt-[-1px]"
              :class="`${index + 1 >= categories.length ? 'rounded-b' : ''} ${
                selectedCategoryId !== category.id
                  ? 'bg-white text-auro-metal-saurus'
                  : ''
              }`"
              color="auro-metal-saurus-black-coral"
              @click="
                selectedCategoryId = category.id;
                loadProducts();
              "
            >
              {{ category.name }}
            </btn>
          </div>
        </div>
        <div class="px-4 w-full sm:max-w-[calc(100%-300px)]">
          <div class="-mx-4 flex flex-wrap">
            <div
              v-for="product in products"
              :key="product.id"
              class="px-4 mb-4 flex flex-col w-full max-w-[100%] lg:max-w-[50%] xl:max-w-[33.3333%] xxl:max-w-[25%]"
            >
              <div class="relative before:block before:pt-[100%]">
                <img
                  class="absolute inset-0 w-full h-full object-center object-cover rounded-t-lg"
                  src="../../assets/product.jpg"
                  alt="Программа"
                />
              </div>
              <div
                class="border-l border-r border-b border-block rounded-b-lg py-4 px-2 flex flex-col flex-1"
              >
                <div class="flex w-full">
                  <div class="font-bold">{{ product.name }}</div>
                  <div class="whitespace-nowrap ml-auto pl-2">
                    {{ product.price.toLocaleString("ru-RU") }} ₽
                  </div>
                </div>
                <div class="text-sm opacity-50">
                  {{ product.category.name }}
                </div>
                <div class="w-full mt-2 mb-auto text-xs">
                  {{ product.description }}
                </div>
                <div class="w-full mt-4 flex">
                  <btn
                    class="mr-auto"
                    :class="{
                      'bg-blueberry text-white border-blueberry':
                        !store.getters.cart[product.id],
                      'bg-apple text-white border-apple':
                        store.getters.cart[product.id],
                    }"
                    @click="store.commit('toggleInCart', product)"
                  >
                    {{
                      store.getters.cart[product.id]
                        ? "Из корзину"
                        : "В корзину"
                    }}
                  </btn>
                  <btn is="router-link" :to="`/catalog/${product.id}`">
                    Подробнее
                  </btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";
import AppLayout from "@/layouts/App.vue";
import BreadcrumbsList from "@/components/Breadcrumbs/List.vue";
import BreadcrumbItem from "@/components/Breadcrumbs/Item.vue";
import FieldInput from "@/components/Form/FieldInput.vue";
import Btn from "@/components/Form/Btn.vue";
import SearchIcon from "@/components/Icons/SearchIcon.vue";
import BtnGroup from "@/components/Form/BtnGroup.vue";
import jsonapi from "@/api/jsonapi";
import {
  v1Category,
  v1CategoryAttributes,
  v1CategoryTransferEntity,
  v1JsonapiTypes,
  v1Product,
  v1ProductAttributes,
  v1ProductFilters,
  v1ProductRelations,
  v1ProductTransferEntity,
} from "@/typings/v1-jsonapi";
import { useStore } from "vuex";
import { pluralize } from "@/utils/text";

const store = useStore();

const productFetcherDeserializer = jsonapi.makeFetcherDeserializer<
  v1ProductTransferEntity,
  v1Product
>(v1JsonapiTypes.Product);
const categoryFetcherDeserializer = jsonapi.makeFetcherDeserializer<
  v1CategoryTransferEntity,
  v1Category
>(v1JsonapiTypes.Category);

let search = ref<string>("");
let selectedCategoryId = ref<string>("");
let categories = ref<v1Category[]>([]);
let products = ref<v1Product[]>([]);
let loadingProducts = ref<boolean>(true);
let loadingCategories = ref<boolean>(true);
let errorHttpCode = ref<number>(0);

const loadProducts = async () => {
  productFetcherDeserializer.abort();
  loadingProducts.value = true;

  const filter: { [key: string]: string } = {};

  if (selectedCategoryId.value) {
    filter[v1ProductFilters.categoryId] = String(selectedCategoryId.value);
  }

  if (search.value) {
    filter[v1ProductFilters.search] = String(search.value);
  }

  try {
    products.value = await productFetcherDeserializer.load({
      sort: "-id",
      page: {
        number: 1,
        size: 8,
      },
      filter,
      include: [v1ProductRelations.category].join(","),
      fields: {
        [v1JsonapiTypes.Product]: [
          v1ProductAttributes.name,
          v1ProductAttributes.description,
          v1ProductAttributes.ordering,
          v1ProductAttributes.category,
          v1ProductAttributes.categoryId,
          v1ProductAttributes.price,
        ].join(","),
      },
    });
  } catch (e: any) {
    if (e.name !== "AbortError") {
      errorHttpCode.value = e.status || 500;
    }
    console.error(e);
  }

  loadingProducts.value = false;
};

const loadCategories = async () => {
  categoryFetcherDeserializer.abort();
  loadingCategories.value = true;

  try {
    categories.value = await categoryFetcherDeserializer.load({
      sort: v1CategoryAttributes.ordering,
      fields: {
        [v1JsonapiTypes.Category]: [
          v1CategoryAttributes.name,
          v1CategoryAttributes.ordering,
        ].join(","),
      },
    });
    console.log("categories", categories);
  } catch (e: any) {
    if (e.name !== "AbortError") {
      errorHttpCode.value = e.status || 500;
    }
    console.error(e);
  }

  loadingCategories.value = false;
};

loadProducts();
loadCategories();

onMounted(() => {
  document.title = "Каталог программ медицинского образования";
});
onUnmounted(() => {
  productFetcherDeserializer.destroy();
  categoryFetcherDeserializer.destroy();
});
const cartTotal = 20022;
</script>

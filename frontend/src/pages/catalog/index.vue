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
                  class="rounded-r-none"
                  placeholder="Поиск"
                  :value="search"
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
            <btn
              class="mt-3 block w-full"
              color="blueberry-white"
              @click="productForm.show = true"
            >
              Добавить товар
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
                        ? "Из корзины"
                        : "В корзину"
                    }}
                  </btn>
                  <btn is="router-link" :to="`/catalog/${product.id}`">
                    Подробнее
                  </btn>
                </div>
                <div class="w-full mt-2 flex">
                  <btn
                    class="mr-auto"
                    color="blueberry-white"
                    :loading="
                      requests.loading[
                        getProductIndex(product, FORM_ACTION_NAME)
                      ]
                    "
                    @click="handleUpdateProduct(product)"
                  >
                    Изменить
                  </btn>
                  <btn
                    color="pastel-red-sunset-orange"
                    :loading="
                      requests.loading[
                        getProductIndex(product, DELETE_ACTION_NAME)
                      ]
                    "
                    @click="handleDeleteProduct(product)"
                  >
                    Удалить
                  </btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <modal :show="productForm.show">
      <div
        class="bg-white rounded shadow whitespace-normal p-4 max-w-[400px] w-full m-auto"
      >
        <div class="mb-2 font-bold">
          {{
            productForm.product
              ? `Изменить товар #${productForm.product.id}`
              : "Добавить товар"
          }}
        </div>
        <label class="mb-2 block">
          <span class="font-bold text-sm">Название*</span>
          <field-input
            :value="productForm.values.name"
            @input="productForm.values.name = $event.target.value"
          />
        </label>
        <label class="mb-2 block">
          <span class="font-bold text-sm">Описание*</span>
          <field-textarea
            :value="productForm.values.description"
            @input="productForm.values.description = $event.target.value"
          />
        </label>
        <label class="mb-2 block">
          <span class="font-bold text-sm">Цена</span>
          <field-input
            type="number"
            :value="productForm.values.price"
            @input="productForm.values.price = $event.target.value"
          />
        </label>
        <label class="mb-2 block">
          <span class="font-bold text-sm">Категория</span>
          <field-select
            :value="productForm.values.categoryId"
            :options="categories.map((category: v1Category) => ({label: category.name, value: category.id}))"
            @change="productForm.values.categoryId = $event.target.value"
          />
        </label>
        <div class="mt-4 flex justify-between">
          <btn
            class="mr-2"
            color="white-cadet-blue-crayola"
            @click="productForm.show = false"
          >
            {{
              requests.loading[
                getProductIndex(productForm.product, FORM_ACTION_NAME)
              ]
                ? "Закрыть"
                : "Отмена"
            }}
          </btn>
          <btn
            color="apple-may-green"
            :loading="
              requests.loading[
                getProductIndex(productForm.product, FORM_ACTION_NAME)
              ]
            "
            :disabled="
              !productForm.values.name || !productForm.values.description
            "
            @click="handleSubmitProductForm"
          >
            {{ productForm.product ? "Изменить" : "Создать" }}
          </btn>
        </div>
      </div>
    </modal>
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
import FieldTextarea from "@/components/Form/FieldTextarea.vue";
import FieldSelect from "@/components/Form/FieldSelect.vue";
import { cloneDeep } from "lodash";
import { JsonapiOneTransfer } from "@/typings/app";
import Modal from "@/components/Modal.vue";

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

const FORM_ACTION_NAME = "form";
const DELETE_ACTION_NAME = "delete";

type ProductForm = {
  show: boolean;
  product: v1Product | null;
  values: {
    name?: string;
    description?: string;
    price?: number;
    ordering?: number;
    categoryId?: number;
  };
};

type Requests = {
  loading: {
    [index: string]: boolean;
  };
  abort: {
    [index: string]: () => void;
  };
};

let defaultProductForm: ProductForm = {
  show: false,
  product: null,
  values: {
    name: "",
    description: "",
    price: 0,
    ordering: 0,
    categoryId: 1,
  },
};
let requests = ref<Requests>({
  loading: {},
  abort: {},
});
let productForm = ref<ProductForm>(cloneDeep(defaultProductForm));

const getProductIndex = (product: v1Product | null, name: string): string => {
  return `product-${product?.id || "create"}-${name}`;
};

const handleSubmitProductForm = async () => {
  const index = getProductIndex(productForm.value.product, FORM_ACTION_NAME);

  if (requests.value.loading[index]) return;

  requests.value.loading[index] = true;

  let body: JsonapiOneTransfer<v1ProductTransferEntity> = {
    data: {
      type: v1JsonapiTypes.Product,
      attributes: {
        name: String(productForm.value.values.name),
        description: String(productForm.value.values.description),
        price: Number(productForm.value.values.price || 0),
        categoryId: Number(productForm.value.values.categoryId),
      },
    },
  };

  try {
    if (productForm.value.product) {
      body.data.id = productForm.value.product.id;
      await jsonapi.updateOne<v1ProductTransferEntity>(body).start();
    } else {
      await jsonapi.storeOne<v1ProductTransferEntity>(body).start();
    }
    productForm.value = cloneDeep(defaultProductForm);
  } catch (e) {
    console.error(e);
  }

  try {
    await loadProducts();
  } catch (e) {
    console.error(e);
  }

  requests.value.loading[index] = false;
};

function handleUpdateProduct(product: v1Product) {
  productForm.value.values.name = product.name;
  productForm.value.values.description = product.description;
  productForm.value.values.price = product.price;
  productForm.value.values.categoryId = product.categoryId;
  productForm.value.values.ordering = product.ordering;
  productForm.value.product = product;
  productForm.value.show = true;
}

async function handleDeleteProduct(product: v1Product) {
  const index = getProductIndex(product, DELETE_ACTION_NAME);

  if (requests.value.loading[index]) return;

  const is = confirm(`Удалить товар #${product.id}`);

  if (!is) return;

  requests.value.loading[index] = true;

  try {
    await jsonapi.deleteOne(v1JsonapiTypes.Product, String(product.id)).start();
  } catch (e) {
    console.error(e);
  }

  try {
    await loadProducts();
  } catch (e) {
    console.error(e);
  }

  requests.value.loading[index] = false;
}

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
</script>

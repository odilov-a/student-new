import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { useHooks } from "hooks";

interface Product {
  _id: string;
  name: string;
  price: number;
  photoUrl: string[];
}

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOrdering, setIsOrdering] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const selectedLang = localStorage.getItem("i18nextLng") || "en";
  const { t } = useHooks();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_ROOT_API}/products?lang=${selectedLang}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  const openConfirmModal = (product: Product) => {
    setSelectedProduct(product);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedProduct(null);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  const confirmOrder = async () => {
    if (!selectedProduct) return;

    setIsOrdering(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_ROOT_API}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          total: selectedProduct.price,
          product: selectedProduct._id,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Order failed");

      setIsConfirmModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (error) {
      if (error instanceof Error) {
        alert(t(error.message));
      } else {
        alert(t("An unknown error occurred"));
      }
    } finally {
      setIsOrdering(false);
    }
  };

  if (loading) return <p>{t("Loading")}...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.map((product) => (
        <div
          key={product._id}
          className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
        >
          <img
            className="rounded-t-lg w-full h-48 object-cover"
            src={product.photoUrl[0]}
            alt={product.name}
          />
          <div className="p-5">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {product.name}
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {t("Narxi")}: {product.price.toLocaleString()} Point
            </p>
            <button
              onClick={() => openConfirmModal(product)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {t("Xarid qilish")}
            </button>
          </div>
        </div>
      ))}

      <Dialog
        open={isConfirmModalOpen}
        onClose={closeConfirmModal}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <Dialog.Title className="text-lg font-bold">
              {t("Tasdiqlash")}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-gray-600">
              {t(
                `Rosatan ham "${selectedProduct?.name}" maxsulotini sotib olmoqchimisiz?`
              )}
            </Dialog.Description>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={closeConfirmModal}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                {t("Bekor qilish")}
              </button>
              <button
                onClick={confirmOrder}
                disabled={isOrdering}
                className="px-4 py-2 text-sm text-white bg-blue-700 rounded-md hover:bg-blue-800 disabled:bg-gray-400"
              >
                {isOrdering ? t("Iltimos kuting...") : t("Ha, sotib olish")}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog
        open={isSuccessModalOpen}
        onClose={closeSuccessModal}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <Dialog.Title className="text-lg font-bold text-green-600">
              {t("Muvaffaqiyat!")}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-gray-600">
              {t(
                "Buyurtma muvaffaqiyatli yaratildi. Tez orada siz bilan adminlar aloqaga chiqadi."
              )}
            </Dialog.Description>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeSuccessModal}
                className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                {t("Yopish")}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Shop;

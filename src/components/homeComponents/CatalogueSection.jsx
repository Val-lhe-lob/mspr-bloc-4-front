import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";

const CatalogueSection = () => {
  const { cartItems, addToCart, decreaseQty, removeFromCart } = useCart();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://615f5fb4f7254d0017068109.mockapi.io/api/v1/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const priceA = parseFloat(a.details.price);
    const priceB = parseFloat(b.details.price);
    if (sortOrder === "asc") return priceA - priceB;
    if (sortOrder === "desc") return priceB - priceA;
    return 0;
  });

  const getQuantity = (id) => {
    const item = cartItems.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <section className="py-20 bg-[#121212] text-white px-4 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-yellow-500 mb-10 text-center">
          Notre Catalogue
        </h2>

        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            className="w-full md:w-1/2 p-3 rounded bg-neutral-800 text-white border border-yellow-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full md:w-1/2 p-3 rounded bg-neutral-800 text-white border border-yellow-500"
          >
            <option value="">Trier par prix</option>
            <option value="asc">Prix croissant</option>
            <option value="desc">Prix décroissant</option>
          </select>
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Chargement...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {sorted.map((product) => {
              const quantity = getQuantity(product.id);
              return (
                <div
                  key={product.id}
                  className="bg-neutral-900 border border-yellow-600/20 p-6 rounded-lg shadow hover:shadow-yellow-500/20 transition duration-300"
                >
                  <h3 className="text-xl font-semibold text-yellow-400 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">
                    {product.details.description}
                  </p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-bold text-yellow-500">
                      {parseFloat(product.details.price).toFixed(2)} €
                    </span>
                    <span className="text-sm text-gray-400">
                      Stock : {product.stock}
                    </span>
                  </div>
                  {quantity === 0 ? (
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full py-2 rounded-full font-semibold bg-yellow-500 text-black hover:bg-yellow-400 transition"
                    >
                      Ajouter au panier
                    </button>
                  ) : (
                    <div className="flex items-center justify-between bg-yellow-500 text-black rounded-full overflow-hidden">
                      <button
                        onClick={() => decreaseQty(product.id)}
                        className="px-4 py-2 hover:bg-yellow-600"
                      >
                        -
                      </button>
                      <span className="px-4 font-semibold">{quantity}</span>
                      <button
                        onClick={() => addToCart(product)}
                        className="px-4 py-2 hover:bg-yellow-600"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="px-4 py-2 bg-red-600 text-white hover:bg-red-500"
                      >
                        x
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CatalogueSection;

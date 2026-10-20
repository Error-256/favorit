const API_URL =
  import.meta.env.VITE_API_URL || "http://api.favorit-parts.ru/hs/hsprice/";
const API_KEY = import.meta.env.VITE_API_KEY || "";

// По документации «не найдено» = массив с одной пустой структурой.
const isEmptyGood = (g) => !g || !g.brand;

async function request(params) {
  const query = new URLSearchParams({ key: API_KEY, ...params }).toString();

  let data;
  let res;
  try {
    res = await fetch(`${API_URL}?${query}`);
  } catch {
    throw new Error("Сервис недоступен. Проверьте подключение к сети.");
  }
  try {
    data = await res.json();
  } catch {
    throw new Error(
      res.ok ? "Сервер вернул некорректный ответ." : `Ошибка сервера: ${res.status}`,
    );
  }

  // Ошибки API приходят полем "error" (строка или несколько ошибок).
  if (data && data.error) {
    const msg = Array.isArray(data.error)
      ? data.error.join(", ")
      : String(data.error);
    throw new Error(`Ошибка API: ${msg}`);
  }

  return Array.isArray(data?.goods)
    ? data.goods.filter((g) => !isEmptyGood(g))
    : [];
}

// Этап 1: все детали с этим номером у разных производителей.
export async function fetchBrands(number) {
  const goods = await request({ number });
  const seen = new Set();
  return goods
    .filter((g) => !seen.has(g.brand) && seen.add(g.brand))
    .map((g) => ({ brand: g.brand, number: g.number, name: g.name }));
}

// Этап 2: сама деталь + её аналоги.
export async function fetchOffers(number, brand) {
  const goods = await request({ number, brand, analogues: "on" });
  const items = [];
  goods.forEach((g) => {
    items.push(g);
    (g.analogues || [])
      .filter((a) => !isEmptyGood(a))
      .forEach((a) => items.push(a));
  });

  return items.flatMap((item) => {
    const base = { brand: item.brand, name: item.name };
    const wh = item.warehouses || [];
    if (wh.length === 0) {
      return [
        {
          ...base,
          key: item.goodsID,
          price: null,
          stock: 0,
        },
      ];
    }
    return wh.map((w) => ({
      ...base,
      key: `${item.goodsID}-${w.id}`,
      price: w.price,
      stock: w.stock,
    }));
  });
}

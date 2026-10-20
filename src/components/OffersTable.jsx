import { useDispatch, useSelector } from 'react-redux';
import { searchOffers } from '../store/searchSlice';
import Loader from './Loader';
import ErrorAlert from './ErrorAlert';

const money = (v) =>
  v == null ? '—' : v.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });

export default function OffersTable() {
  const dispatch = useDispatch();
  const { query, selectedBrand } = useSelector((s) => s.search);
  const { items, status, error } = useSelector((s) => s.search.offers);

  if (!selectedBrand || status === 'idle') return null;

  const retry = () =>
    dispatch(searchOffers({ number: query, brand: selectedBrand.brand }));

  return (
    <div>
      <h2 className="h5">
        Аналоги и предложения: {selectedBrand.brand} {selectedBrand.number}
      </h2>

      {status === 'loading' && <Loader text="Загружаем предложения…" />}

      {status === 'error' && <ErrorAlert message={error} onRetry={retry} />}

      {status === 'success' && items.length === 0 && (
        <div className="alert alert-secondary">Предложений не найдено.</div>
      )}

      {status === 'success' && items.length > 0 && (
        <div className="table-responsive card shadow-sm">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Производитель</th>
                <th>Название</th>
                <th className="text-end">Цена</th>
                <th className="text-end">Остаток</th>
              </tr>
            </thead>
            <tbody>
              {items.map((o) => (
                <tr key={o.key} className={o.stock > 0 ? '' : 'text-muted'}>
                  <td>
                    <strong>{o.brand}</strong>
                  </td>
                  <td>{o.name}</td>
                  <td className="text-end text-nowrap">{money(o.price)}</td>
                  <td className="text-end">
                    {o.stock > 0 ? o.stock : <span className="badge text-bg-secondary">нет</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

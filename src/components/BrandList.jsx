import { useDispatch, useSelector } from 'react-redux';
import { searchBrands, searchOffers, selectBrand } from '../store/searchSlice';
import Loader from './Loader';
import ErrorAlert from './ErrorAlert';

export default function BrandList() {
  const dispatch = useDispatch();
  const { query, selectedBrand } = useSelector((s) => s.search);
  const { items, status, error } = useSelector((s) => s.search.brands);

  if (status === 'idle') return null;

  const choose = (b) => {
    dispatch(selectBrand(b));
    dispatch(searchOffers({ number: query, brand: b.brand }));
  };

  return (
    <div className="mb-4">
      <h2 className="h5">Шаг 2. Выберите производителя</h2>

      {status === 'loading' && <Loader text="Ищем производителей…" />}

      {status === 'error' && (
        <ErrorAlert message={error} onRetry={() => dispatch(searchBrands(query))} />
      )}

      {status === 'success' && items.length === 0 && (
        <div className="alert alert-secondary">По артикулу «{query}» ничего не найдено.</div>
      )}

      {status === 'success' && items.length > 0 && (
        <div className="list-group shadow-sm">
          {items.map((b) => (
            <button
              key={b.brand}
              type="button"
              className={
                'list-group-item list-group-item-action' +
                (selectedBrand?.brand === b.brand ? ' active' : '')
              }
              onClick={() => choose(b)}
            >
              <strong>{b.brand}</strong>
              <span className="ms-2">{b.number}</span>
              {b.name && <div className="small opacity-75">{b.name}</div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

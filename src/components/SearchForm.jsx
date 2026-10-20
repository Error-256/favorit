import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNumber, searchBrands, reset } from "../store/searchSlice";

const MIN_LENGTH = 3;
const DEBOUNCE_MS = 600;

export default function SearchForm() {
  const dispatch = useDispatch();
  const number = useSelector((s) => s.search.number);

  // Поиск, запрос уходит после паузы в наборе.
  useEffect(() => {
    const value = number.trim();
    if (value.length < MIN_LENGTH) return;
    const t = setTimeout(() => dispatch(searchBrands(value)), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [number, dispatch]);

  const onSubmit = (e) => {
    e.preventDefault();
    const value = number.trim();
    if (value) dispatch(searchBrands(value));
  };

  return (
    <form className="card card-body mb-4 shadow-sm" onSubmit={onSubmit}>
      <label htmlFor="number" className="form-label fw-semibold">
        Шаг 1. Артикул детали
      </label>
      <div className="input-group">
        <input
          id="number"
          className="form-control"
          placeholder="Например, 7160500039S"
          value={number}
          onChange={(e) => dispatch(setNumber(e.target.value))}
          autoComplete="off"
          autoFocus
        />
        <button
          className="btn btn-primary"
          type="submit"
          disabled={!number.trim()}
        >
          Найти
        </button>
        {number && (
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => dispatch(reset())}
          >
            Сбросить
          </button>
        )}
      </div>
      <div className="form-text">
        Поиск запускается автоматически от {MIN_LENGTH} символов.
      </div>
    </form>
  );
}

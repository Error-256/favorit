import SearchForm from './components/SearchForm';
import BrandList from './components/BrandList';
import OffersTable from './components/OffersTable';

export default function App() {
  return (
    <div className="container py-4" style={{ maxWidth: 1100 }}>
      <h1 className="h3 mb-1">Поиск автозапчастей и аналогов</h1>
      <p className="text-muted mb-4">
        Введите артикул, выберите производителя — получите аналоги, цены и остатки.
      </p>
      <SearchForm />
      <BrandList />
      <OffersTable />
    </div>
  );
}

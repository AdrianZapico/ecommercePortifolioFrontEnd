import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify'; // Recomendo usar para feedbacks melhores
import type { RootState } from '../../store';

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  // Estados dos campos
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  // Estados de controle de UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { userInfo } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setBrand(data.brand);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
    } else {
      fetchProduct();
    }
  }, [productId, navigate, userInfo]);

  // Handler de Upload Refatorado
  const uploadFileHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo?.token}`, // Garantindo autorização
        },
      };

      const { data } = await axios.post('/api/upload', formData, config);

      setImage(data);
      setUploading(false);
      // alert('Imagem carregada!'); // Ou use toast.success
    } catch (err: any) {
      console.error(err);
      setUploading(false);
      alert(err.response?.data?.message || 'Erro ao carregar imagem');
    }
  };

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setLoadingUpdate(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      await axios.put(
        `/api/products/${productId}`,
        { name, price, image, brand, category, description, countInStock },
        config
      );

      setLoadingUpdate(false);
      navigate('/admin/productlist');
    } catch (err: any) {
      setLoadingUpdate(false);
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container mx-auto mt-10 px-4 max-w-2xl pb-20">
      <Link to="/admin/productlist" className="text-slate-600 hover:text-slate-900 mb-6 flex items-center gap-2 transition">
        &larr; Voltar para a lista
      </Link>

      <div className="bg-white p-8 rounded-xl shadow-2xl border border-slate-100">
        <h1 className="text-3xl font-extrabold mb-8 text-slate-800 border-b pb-4">Editar Produto</h1>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-900"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">{error}</div>
        ) : (
          <form onSubmit={submitHandler} className="space-y-5">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* NOME */}
              <div className="md:col-span-2">
                <label className="block text-slate-700 font-bold mb-2">Nome do Produto</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-400 outline-none transition"
                />
              </div>

              {/* PREÇO */}
              <div>
                <label className="block text-slate-700 font-bold mb-2">Preço (R$)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-400 outline-none"
                />
              </div>

              {/* ESTOQUE */}
              <div>
                <label className="block text-slate-700 font-bold mb-2">Qtd em Estoque</label>
                <input
                  type="number"
                  value={countInStock}
                  onChange={(e) => setCountInStock(Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-400 outline-none"
                />
              </div>
            </div>

            {/* IMAGEM */}
            <div className="bg-slate-50 p-4 rounded-lg border border-dashed border-slate-300">
              <label className="block text-slate-700 font-bold mb-2">Imagem do Produto</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg mb-3 bg-white"
                placeholder="URL da imagem ou faça upload abaixo"
              />
              <input
                type="file"
                onChange={uploadFileHandler}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-700 cursor-pointer"
              />
              {uploading && (
                <div className="flex items-center gap-2 mt-2 text-blue-600 font-medium animate-pulse">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Enviando imagem...
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* MARCA */}
              <div>
                <label className="block text-slate-700 font-bold mb-2">Marca</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-400 outline-none"
                />
              </div>

              {/* CATEGORIA */}
              <div>
                <label className="block text-slate-700 font-bold mb-2">Categoria</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-400 outline-none"
                />
              </div>
            </div>

            {/* DESCRIÇÃO */}
            <div>
              <label className="block text-slate-700 font-bold mb-2">Descrição</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-400 outline-none h-32 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loadingUpdate || uploading}
              className="bg-slate-900 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-800 transition w-full shadow-lg active:scale-[0.98] disabled:opacity-50"
            >
              {loadingUpdate ? 'Salvando Alterações...' : 'Atualizar Produto'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductEditScreen;
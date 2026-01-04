import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import type { RootState } from '../../store';

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  // Estados dos campos do formulário
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  // Estados de controle
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const { userInfo } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Busca o produto para preencher os campos
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

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoadingUpdate(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      await axios.put(
        `/api/products/${productId}`,
        {
          name,
          price,
          image,
          brand,
          category,
          description,
          countInStock,
        },
        config
      );

      setLoadingUpdate(false);
      navigate('/admin/productlist'); // Volta para a lista após salvar
    } catch (err: any) {
      setLoadingUpdate(false);
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container mx-auto mt-10 px-4 max-w-2xl">
      <Link to="/admin/productlist" className="text-slate-600 hover:underline mb-4 block">
        &larr; Voltar
      </Link>

      <h1 className="text-3xl font-bold mb-6 text-slate-800">Editar Produto</h1>

      {loading ? (
        <p>Carregando dados...</p>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      ) : (
        <form onSubmit={submitHandler} className="bg-white p-6 rounded shadow-md">

          {/* NOME */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Nome</label>
            <input
              type="text"
              placeholder="Digite o nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-slate-500"
            />
          </div>

          {/* PREÇO */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Preço</label>
            <input
              type="number"
              placeholder="Digite o preço"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-slate-500"
            />
          </div>

          {/* IMAGEM (Por enquanto URL manual) */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Imagem (URL)</label>
            <input
              type="text"
              placeholder="Insira a url da imagem"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-slate-500"
            />
          </div>

          {/* MARCA */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Marca</label>
            <input
              type="text"
              placeholder="Digite a marca"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-slate-500"
            />
          </div>

          {/* ESTOQUE */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Qtd em Estoque</label>
            <input
              type="number"
              placeholder="Digite a quantidade"
              value={countInStock}
              onChange={(e) => setCountInStock(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-slate-500"
            />
          </div>

          {/* CATEGORIA */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Categoria</label>
            <input
              type="text"
              placeholder="Digite a categoria"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-slate-500"
            />
          </div>

          {/* DESCRIÇÃO */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Descrição</label>
            <textarea
              placeholder="Digite a descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-slate-500 h-24"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loadingUpdate}
            className="bg-slate-900 text-white font-bold py-2 px-4 rounded hover:bg-slate-700 transition w-full"
          >
            {loadingUpdate ? 'Atualizando...' : 'Atualizar Produto'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ProductEditScreen;
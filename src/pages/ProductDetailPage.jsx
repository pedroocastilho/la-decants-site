import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Heart, Minus, Plus, Star, Truck, ShieldCheck, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { ProductCard } from '@/features/products/ProductCard';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabaseClient';

export function ProductDetailPage() {
    const { slug } = useParams();
    const {
        allProducts,
        addToCart,
        favorites,
        toggleFavorite,
        openNotifyModal,
        session
    } = useAppContext();

    const product = allProducts.find(p => p.slug === slug);

    // --- LÓGICA DA GALERIA ---
    const images = React.useMemo(() => {
        if (!product) return [];
        return [product.image, product.imageNotes].filter(Boolean);
    }, [product]);

    const [selectedImage, setSelectedImage] = React.useState('');
    const [currentIndex, setCurrentIndex] = React.useState(0);

    React.useEffect(() => {
        if (images.length > 0) {
            setSelectedImage(images[0]);
            setCurrentIndex(0);
        }
    }, [images]);

    const handleNextImage = (e) => {
        e.stopPropagation();
        const nextIndex = (currentIndex + 1) % images.length;
        setCurrentIndex(nextIndex);
        setSelectedImage(images[nextIndex]);
    };

    const handlePrevImage = (e) => {
        e.stopPropagation();
        const prevIndex = (currentIndex - 1 + images.length) % images.length;
        setCurrentIndex(prevIndex);
        setSelectedImage(images[prevIndex]);
    };

    // --- LÓGICA DE STOCK ---
    const isSoldOut = product?.stock === 0;
    const [quantity, setQuantity] = React.useState(1);
    const incrementQuantity = () => {
        if (product && quantity < product.stock) {
            setQuantity(prev => prev + 1);
        }
    };
    const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

    React.useEffect(() => {
        if (product && product.stock > 0) {
            setQuantity(1);
        }
    }, [product]);

    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

    const relatedProducts = product
        ? allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 5)
        : [];

    // --- INÍCIO DA NOVA LÓGICA DE AVALIAÇÕES ---
    const [reviews, setReviews] = React.useState([]);
    const [loadingReviews, setLoadingReviews] = React.useState(true);
    const [userRating, setUserRating] = React.useState(0);
    const [userComment, setUserComment] = React.useState('');
    const [hasPurchased, setHasPurchased] = React.useState(false);

    const averageRating = React.useMemo(() => {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (total / reviews.length).toFixed(1);
    }, [reviews]);

    React.useEffect(() => {
        const fetchReviews = async () => {
            if (!product) return;
            setLoadingReviews(true);
            const { data, error } = await supabase
                .from('reviews')
                .select(`*, profiles(full_name)`)
                .eq('product_id', product.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Erro ao buscar avaliações:", error);
            } else {
                setReviews(data);
            }
            setLoadingReviews(false);
        };
        fetchReviews();
    }, [product]);

    React.useEffect(() => {
      const checkPurchaseStatus = async () => {
        if (session?.user && product) {
          const { data, error } = await supabase.functions.invoke('check-purchase', {
            body: { userId: session.user.id, productId: product.id }
          });
          if (error) {
            console.error("Erro ao verificar compra:", error);
          } else {
            setHasPurchased(data.hasPurchased);
          }
        } else {
          setHasPurchased(false);
        }
      };
      checkPurchaseStatus();
    }, [session, product]);


    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (userRating === 0) {
            toast.error("Por favor, selecione uma avaliação de 1 a 5 estrelas.");
            return;
        }
        if (!session?.user) {
            toast.error("Você precisa de estar autenticado para deixar uma avaliação.");
            return;
        }

        const { error } = await supabase.from('reviews').insert({
            user_id: session.user.id,
            product_id: product.id,
            rating: userRating,
            comment: userComment,
        });

        if (error) {
            toast.error("Ocorreu um erro ao enviar a sua avaliação.");
            console.error("Erro ao inserir avaliação:", error);
        } else {
            toast.success("Avaliação enviada com sucesso! Obrigado.");
            const { data } = await supabase.from('reviews').select('*, profiles(full_name)').eq('product_id', product.id).order('created_at', { ascending: false });
            if (data) setReviews(data);
            setUserRating(0);
            setUserComment('');
        }
    };
    // --- FIM DA NOVA LÓGICA DE AVALIAÇÕES ---

    if (!product) {
        return (
            <main className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold">Produto não encontrado</h1>
                <Link to="/" className="text-[#AB7D47] hover:underline mt-4 inline-block">
                    Voltar para a página inicial
                </Link>
            </main>
        );
    }

    const isFavorite = favorites.has(product.id);

    return (
        <>
            <main className="container mx-auto px-4 py-8">
                <div className="text-sm text-gray-600 mb-6">
                    <Link to="/" className="hover:text-black">Início</Link>
                    <span className="mx-2">›</span>
                    <Link to={`/${product.category.toLowerCase()}s`} className="hover:text-black">{product.category}s</Link>
                    <span className="mx-2">›</span>
                    <span className="text-black font-medium">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {/* Coluna da Esquerda: Galeria de Imagens */}
                    <div className="w-full max-w-lg mx-auto space-y-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className="relative group cursor-zoom-in">
                                    <img src={selectedImage} alt={product.name} className="w-full rounded-lg object-cover aspect-square" />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ZoomIn className="w-12 h-12 text-white" />
                                    </div>
                                    {images.length > 1 && (
                                        <>
                                            <Button onClick={handlePrevImage} variant="ghost" className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full h-10 w-10 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ChevronLeft className="w-6 h-6 text-gray-800" />
                                            </Button>
                                            <Button onClick={handleNextImage} variant="ghost" className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full h-10 w-10 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ChevronRight className="w-6 h-6 text-gray-800" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </DialogTrigger>
                            <DialogContent className="w-auto max-w-[80vw] max-h-[80vh] bg-transparent border-none shadow-none p-0 overflow-hidden">
                                <div className="relative h-full w-full flex items-center justify-center">
                                    <img src={selectedImage} alt={product.name} className="block h-full w-full object-contain transition-transform duration-300 ease-in-out hover:scale-110" />
                                </div>
                            </DialogContent>
                        </Dialog>
                        {images.length > 1 && (
                            <div className="grid grid-cols-5 gap-2">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setSelectedImage(img);
                                            setCurrentIndex(index);
                                        }}
                                        className={cn('rounded-md border-2 aspect-square overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AB7D47]', selectedImage === img ? 'border-[#AB7D47]' : 'border-transparent')}
                                    >
                                        <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Coluna da Direita: Informações */}
                    <div className="flex flex-col space-y-4">
                        {isSoldOut ? (
                            <Badge className="bg-red-500 text-white w-fit">ESGOTADO</Badge>
                        ) : (
                            <Badge className={`${product.badgeColor} text-white w-fit`}>{product.badge}</Badge>
                        )}
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-serif">{product.name}</h1>
                        
                        {reviews.length > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {/* Mostra as estrelas com base na média */}
                              {[...Array(Math.round(averageRating))].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                              {[...Array(5 - Math.round(averageRating))].map((_, i) => <Star key={i} className="w-4 h-4 text-gray-300" />)}
                            </div>
                            <span className="text-sm text-gray-500">
                              {averageRating} ({reviews.length} avaliaç{reviews.length > 1 ? 'ões' : 'ão'})
                            </span>
                          </div>
                        )}

                        <div className="space-y-1 pt-2">
                            <span className="text-sm text-gray-500 line-through">R${product.originalPrice.toFixed(2)}</span>
                            <p className="text-4xl font-bold text-gray-900">R${product.price.toFixed(2)}</p>
                            <p className="text-sm text-gray-600">ou 5x de R${(product.price / 5).toFixed(2)} sem juros</p>
                        </div>
                        <div className="border-t pt-4 space-y-4">
                            <div className="flex items-center gap-4">
                                <p className="font-semibold">Tamanho: <Badge variant="outline">{product.size}</Badge></p>
                            </div>
                            <div className="flex items-center gap-4">
                                <p className="font-semibold">Quantidade:</p>
                                <div className="flex items-center border rounded-md">
                                    <Button variant="ghost" size="sm" onClick={decrementQuantity} className="px-3" disabled={isSoldOut}><Minus className="w-4 h-4" /></Button>
                                    <span className="px-4 font-semibold">{isSoldOut ? 0 : quantity}</span>
                                    <Button variant="ghost" size="sm" onClick={incrementQuantity} className="px-3" disabled={isSoldOut}><Plus className="w-4 h-4" /></Button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button
                                    onClick={isSoldOut ? () => openNotifyModal(product) : handleAddToCart}
                                    size="lg"
                                    className="w-full bg-[#AB7D47] hover:bg-[#966834] text-white cursor-pointer"
                                >
                                    {isSoldOut ? "Avise-me Quando Chegar" : "Adicionar ao Carrinho"}
                                </Button>
                                <Button variant="outline" size="lg" className="w-full" onClick={() => toggleFavorite(product.id)}>
                                    <Heart className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-red-700 text-red-700' : ''}`} />
                                    {isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                                </Button>
                            </div>
                        </div>
                        <div className="border rounded-lg p-4 space-y-3 text-sm">
                            <div className="flex items-center gap-3">
                                <Truck className="w-5 h-5 text-[#AB7D47]" />
                                <p><strong>Frete Grátis</strong> em compras acima de R$ 299,00</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-[#AB7D47]" />
                                <p><strong>Compra Segura.</strong> Seus dados estão protegidos.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Seção de Descrição */}
                <div className="border-t mt-12 pt-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Descrição</h2>
                    <div
                        className="prose max-w-none text-gray-700 mb-4"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                </div>

                {/* --- NOVA SECÇÃO DE AVALIAÇÕES --- */}
                <div className="border-t mt-12 pt-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Avaliações de Clientes</h2>
                    
                    {session && hasPurchased && (
                        <form onSubmit={handleReviewSubmit} className="mb-8 p-6 border rounded-lg bg-gray-50">
                          {/* ... (código do formulário inalterado) ... */}
                        </form>
                    )}

                    <div className="space-y-6">
                        {loadingReviews && <p>A carregar avaliações...</p>}
                        {!loadingReviews && reviews.length === 0 && <p>Este produto ainda não tem avaliações. Seja o primeiro a comprar e avaliar!</p>}
                        {!loadingReviews && reviews.map(review => (
                            <div key={review.id} className="border-b pb-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="flex">
                                        {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                                        {[...Array(5 - review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-gray-300" />)}
                                    </div>
                                    <p className="font-semibold">{review.profiles?.full_name || 'Anónimo'}</p>
                                </div>
                                <p className="text-gray-600">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Seção de Produtos Relacionados */}
            {relatedProducts.length > 0 && (
                <section className="bg-gray-50 py-12 mt-8">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Produtos Relacionados</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                            {relatedProducts.map(related => (
                                <Link key={related.id} to={`/produto/${related.slug}`}>
                                    <ProductCard
                                        product={related}
                                        isFavorite={favorites.has(related.id)}
                                        onToggleFavorite={toggleFavorite}
                                        onAddToCart={addToCart}
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
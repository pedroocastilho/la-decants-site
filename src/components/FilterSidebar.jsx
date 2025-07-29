import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Checkbox } from '@/components/ui/checkbox.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Slider } from '@/components/ui/slider.jsx';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet.jsx';
import { Filter, X } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FilterSidebar({ isOpen, onClose }) {
  const {
    filters,
    setFilters,
    productsForFilter,
  } = useAppContext();
  
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(prev => ({
      ...prev,
      ...filters,
      subCategories: filters.subCategories || [],
    }));
  }, [isOpen, filters]);

  // A lógica para gerar as opções disponíveis continua a mesma
  const availableBrands = useMemo(() => {
    const brands = productsForFilter.map(p => p.brand);
    return [...new Set(brands)].sort();
  }, [productsForFilter]);

  const availableCategories = useMemo(() => {
    const categories = productsForFilter.map(p => p.category);
    return [...new Set(categories)].sort();
  }, [productsForFilter]);
  
  const availableSizes = useMemo(() => {
    const sizes = productsForFilter.map(p => p.size);
    return [...new Set(sizes)].sort();
  }, [productsForFilter]);

  const availableSubCategories = useMemo(() => {
    const subCats = productsForFilter.map(p => p.subCategory).filter(Boolean);
    return [...new Set(subCats)].sort();
  }, [productsForFilter]);

  // As funções para manipular os filtros continuam as mesmas
  const handleBrandChange = (brand, checked) => {
    const newBrands = checked ? [...localFilters.brands, brand] : localFilters.brands.filter(b => b !== brand);
    setLocalFilters(prev => ({ ...prev, brands: newBrands }));
  };
  const handleCategoryChange = (category, checked) => {
    const newCategories = checked ? [...localFilters.categories, category] : localFilters.categories.filter(c => c !== category);
    setLocalFilters(prev => ({ ...prev, categories: newCategories }));
  };
  const handleSubCategoryChange = (subCategory, checked) => {
    const newSubCategories = checked ? [...(localFilters.subCategories || []), subCategory] : (localFilters.subCategories || []).filter(sc => sc !== subCategory);
    setLocalFilters(prev => ({ ...prev, subCategories: newSubCategories }));
  };
  const handleSizeChange = (size, checked) => {
    const newSizes = checked ? [...localFilters.sizes, size] : localFilters.sizes.filter(s => s !== size);
    setLocalFilters(prev => ({ ...prev, sizes: newSizes }));
  };
  const handlePriceChange = (value) => {
    setLocalFilters(prev => ({ ...prev, priceRange: value }));
  };

  const applyFilters = () => {
    setFilters(localFilters);
    onClose();
  };

  const clearFilters = () => {
    const emptyFilters = {
      brands: [], categories: [], sizes: [], subCategories: [], priceRange: [0, 200]
    };
    setLocalFilters(emptyFilters);
    setFilters(emptyFilters);
  };
  
  const hasActiveFilters = (localFilters.brands && localFilters.brands.length > 0) || 
                         (localFilters.categories && localFilters.categories.length > 0) || 
                         (localFilters.subCategories && localFilters.subCategories.length > 0) ||
                         (localFilters.sizes && localFilters.sizes.length > 0) ||
                         localFilters.priceRange[0] > 0 || 
                         localFilters.priceRange[1] < 200;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-full sm:max-w-sm flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </SheetTitle>
          <SheetDescription>
            Refine sua busca por produtos
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 -mx-6 px-6">
          <Accordion type="multiple" defaultValue={['price', 'brands', 'subCategories']} className="w-full">
            {/* Faixa de Preço (sempre aparece) */}
            <AccordionItem value="price">
              <AccordionTrigger className="text-base font-semibold">Faixa de Preço</AccordionTrigger>
              <AccordionContent>
                <div className="px-1 pt-2">
                  <Slider value={localFilters.priceRange} onValueChange={handlePriceChange} max={200} min={0} step={5} className="w-full" />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>R${localFilters.priceRange[0]}</span>
                    <span>R${localFilters.priceRange[1]}</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Marcas (só aparece se houver mais de 1 marca para escolher) */}
            {availableBrands.length > 1 && (
              <AccordionItem value="brands">
                <AccordionTrigger className="text-base font-semibold">Marcas</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2 max-h-48 overflow-y-auto">
                    {availableBrands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox id={`brand-${brand}`} checked={localFilters.brands.includes(brand)} onCheckedChange={(checked) => handleBrandChange(brand, checked)} />
                        <Label htmlFor={`brand-${brand}`} className="text-sm font-normal cursor-pointer">{brand}</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {/* Tipo de Produto (só aparece se houver subcategorias E se estivermos a filtrar apenas uma marca) */}
            {availableSubCategories.length > 0 && availableBrands.length <= 1 && (
              <AccordionItem value="subCategories">
                <AccordionTrigger className="text-base font-semibold">Tipo de Produto</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {availableSubCategories.map((subCat) => (
                      <div key={subCat} className="flex items-center space-x-2">
                        <Checkbox id={`subCat-${subCat}`} checked={localFilters.subCategories?.includes(subCat)} onCheckedChange={(checked) => handleSubCategoryChange(subCat, checked)} />
                        <Label htmlFor={`subCat-${subCat}`} className="text-sm font-normal cursor-pointer">{subCat}</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Categorias (só aparece se houver mais de 1 categoria para escolher) */}
            {availableCategories.length > 1 && (
              <AccordionItem value="categories">
                <AccordionTrigger className="text-base font-semibold">Categoria</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {availableCategories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox id={`category-${category}`} checked={localFilters.categories.includes(category)} onCheckedChange={(checked) => handleCategoryChange(category, checked)} />
                        <Label htmlFor={`category-${category}`} className="text-sm font-normal cursor-pointer">{category}</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {/* Tamanhos (só aparece se houver tamanhos definidos) */}
            {availableSizes.length > 0 && (
              <AccordionItem value="sizes">
                <AccordionTrigger className="text-base font-semibold">Tamanho</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {availableSizes.map((size) => (
                      <div key={size} className="flex items-center space-x-2">
                        <Checkbox id={`size-${size}`} checked={localFilters.sizes.includes(size)} onCheckedChange={(checked) => handleSizeChange(size, checked)} />
                        <Label htmlFor={`size-${size}`} className="text-sm font-normal cursor-pointer">{size}</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>

        {/* Botões no rodapé */}
        <div className="border-t pt-4 space-y-3">
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="w-full border-gray-300 text-gray-600 hover:bg-gray-50">
              <X className="w-4 h-4 mr-2" />
              Limpar Filtros
            </Button>
          )}
          <Button onClick={applyFilters} className="w-full bg-[#AB7D47] hover:bg-[#B8860B] text-white">
            Aplicar Filtros
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export const calculateDiscount = (totalCost) => {
    // Obtener el costo base como número
    const baseCost = +totalCost.net_unit_cost || 0;

    // Si no hay descuento, retornar el costo neto base
    if (!totalCost.discount_value || totalCost.discount_value <= 0) {
        return baseCost;
    }

    if (totalCost.discount_type === '2' || totalCost.discount_type === 2) {
        // Descuento fijo
        return Math.max(0, baseCost - Number(totalCost.discount_value));
    } else if (totalCost.discount_type === '1' || totalCost.discount_type === 1) {
        // Descuento porcentual
        const percentDiscount = baseCost * Number(totalCost.discount_value) / 100;
        return Math.max(0, baseCost - percentDiscount);
    }

    // Por defecto, retornar el costo neto sin descuento
    return baseCost;
};

export const calculateTax = (totalCost, finalCount) => {
    // Convertir finalCount a número
    const baseAmount = +finalCount || 0;

    // Si no hay impuesto, retornar el valor actual
    if (!totalCost.tax_value || totalCost.tax_value <= 0) {
        return baseAmount;
    }

    if (totalCost.tax_type === '2' || totalCost.tax_type === 2) {
        // Impuesto inclusivo - el finalCount ya incluye el impuesto
        return baseAmount;
    } else if (totalCost.tax_type === '1' || totalCost.tax_type === 1) {
        // Impuesto exclusivo - agregar el impuesto al finalCount
        const exclusiveTax = baseAmount * Number(totalCost.tax_value) / 100;
        return baseAmount + exclusiveTax;
    }

    // Por defecto, retornar el valor sin cambios
    return baseAmount;
};

export const calculateProductCost = (product) => {
    try {
        // Validar que el producto tenga los datos necesarios
        if (!product || typeof product !== 'object') {
            console.warn('Invalid product object:', product);
            return 0;
        }

        // Para productos en el carrito, usar directamente el precio
        // Si no tiene propiedades de descuento/impuesto, retornar el precio base
        const basePrice = product.product_price || product.price || 0;

        // Si el producto no tiene información de descuento/impuesto, retornar precio base
        if (!product.discount_value && !product.tax_value) {
            return +basePrice;
        }

        // Si tiene información de descuento/impuesto, hacer el cálculo completo
        const productForCalculation = {
            net_unit_cost: basePrice,
            discount_value: product.discount_value || 0,
            discount_type: product.discount_type || '0',
            tax_value: product.tax_value || 0,
            tax_type: product.tax_type || '0'
        };

        let finalCount = 0;
        finalCount = calculateDiscount(productForCalculation);
        finalCount = calculateTax(productForCalculation, finalCount);

        // Asegurar que retorna un número válido
        const result = typeof finalCount === 'number' && !isNaN(finalCount) ? finalCount : basePrice;

        console.log('Product cost calculation:', {
            product: product.name || 'Unknown',
            basePrice: basePrice,
            hasDiscount: !!product.discount_value,
            hasTax: !!product.tax_value,
            finalCost: result
        });

        return result;
    } catch (error) {
        console.error('Error calculating product cost:', error, product);
        // En caso de error, retornar el precio base del producto
        return +(product.product_price || product.price || 0);
    }
}

export const prepareCartAssistanceArray = (assistances) => {
    let cartAssistanceRowArray = [];
    assistances.forEach(assistance => {
        const taxAmount = (unitPrice) => {
            const total = Number(unitPrice);
            let tax = 0;

            if (assistance.attributes.tax_rate > 0) {
                if (assistance.attributes.tax_type === 1 || assistance.attributes.tax_type === '1') {
                    tax = (total * Number(assistance.attributes.tax_rate)) / 100;
                } else if (assistance.attributes.tax_type === 2 || assistance.attributes.tax_type === '2') {
                    tax = total - (total / (1 + Number(assistance.attributes.tax_rate) / 100));
                }
            }

            return parseFloat(tax.toFixed(2));
        };

        cartAssistanceRowArray.push({
            name: assistance.attributes.name,
            code: assistance.attributes.code || `ASS-${assistance.id}`,
            assistance_id: assistance.id,
            item_type: 'assistance', // Importante: identificador del tipo
            cost: assistance.attributes.cost || assistance.attributes.price,
            net_unit_cost: assistance.attributes.price,
            tax_type: assistance.attributes.tax_type?.value ? Number(assistance.attributes.tax_type.value) : (assistance.attributes.tax_type || 1),
            price: assistance.attributes.price,
            tax_amount: taxAmount(assistance.attributes.price),
            discount_type: 1,
            discount_value: 0,
            discount_amount: 0,
            duration: assistance.attributes.duration || 1,
            duration_unit: assistance.attributes.duration_unit || 'Hour',
            quantity: 1, // Para asistencias, cantidad por defecto es 1
            sub_total: 0,
            id: assistance.id,
            sale_id: 1,
            tax_value: assistance.attributes.tax_rate ?? 0,
            hold_item_id: '',
            warehouse_id: 0,
            assistance_type: assistance.attributes.assistance_type || 'Service',
            description: assistance.attributes.description || '',
            // Campos específicos para asistencias
            technician_id: assistance.attributes.technician_id || null,
            estimated_time: assistance.attributes.estimated_time || assistance.attributes.duration,
            requires_approval: assistance.attributes.requires_approval || false,
        });
    });
    return cartAssistanceRowArray;
};

// Función combinada para manejar productos y asistencias
export const prepareMixedCartArray = (items) => {
    let cartRowArray = [];

    items.forEach(item => {
        const taxAmount = (unitPrice, taxRate, taxType) => {
            const total = Number(unitPrice);
            let tax = 0;

            if (taxRate > 0) {
                if (taxType === 1 || taxType === '1') {
                    tax = (total * Number(taxRate)) / 100;
                } else if (taxType === 2 || taxType === '2') {
                    tax = total - (total / (1 + Number(taxRate) / 100));
                }
            }

            return parseFloat(tax.toFixed(2));
        };

        // Verificar si es producto o asistencia
        const isAssistance = item.item_type === 'assistance' || item.attributes?.assistance_type;

        if (isAssistance) {
            // Manejo para asistencias
            cartRowArray.push({
                name: item.attributes.name,
                code: item.attributes.code || `ASS-${item.id}`,
                assistance_id: item.id,
                item_type: 'assistance',
                cost: item.attributes.cost || item.attributes.price,
                net_unit_cost: item.attributes.price,
                tax_type: item.attributes.tax_type?.value ? Number(item.attributes.tax_type.value) : (item.attributes.tax_type || 1),
                price: item.attributes.price,
                tax_amount: taxAmount(item.attributes.price, item.attributes.tax_rate, item.attributes.tax_type),
                discount_type: 1,
                discount_value: 0,
                discount_amount: 0,
                duration: item.attributes.duration || 1,
                duration_unit: item.attributes.duration_unit || 'Hour',
                quantity: item.quantity || 1,
                sub_total: 0,
                id: item.id,
                sale_id: 1,
                tax_value: item.attributes.tax_rate ?? 0,
                hold_item_id: '',
                warehouse_id: item.warehouse_id || 0,
                assistance_type: item.attributes.assistance_type || 'Service',
                description: item.attributes.description || '',
            });
        } else {
            // Manejo para productos (código original)
            cartRowArray.push({
                name: item.attributes.name,
                code: item.attributes.code,
                stock_alert: item.attributes.stock_alert,
                product_id: item.id,
                item_type: 'product',
                product_cost: item.attributes.product_cost,
                net_unit_cost: item.attributes.product_price,
                tax_type: item.attributes.tax_type.value ? Number(item.attributes.tax_type.value) : item.attributes.tax_type,
                product_price: item.attributes.product_price,
                tax_amount: taxAmount(item.attributes.product_price, item.attributes.order_tax, item.attributes.tax_type),
                discount_type: 1,
                discount_value: 0,
                discount_amount: 0,
                product_unit: item.attributes.product_unit,
                sale_unit: item.attributes.sale_unit,
                quantity: item?.attributes?.stock?.quantity > 1 ? 1 : item?.attributes?.stock?.quantity,
                sub_total: 0,
                id: item.id,
                sale_id: 1,
                tax_value: item.attributes.order_tax ?? 0,
                hold_item_id: '',
                quantity_limit: item.attributes.quantity_limit,
                warehouse_id: item.warehouse_id || 0
            });
        }
    });

    return cartRowArray;
};

import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { InputGroup, Table } from 'react-bootstrap-v5';
import { searchPurchaseProduct } from '../../store/action/purchaseProductAction';
import { editPurchase } from '../../store/action/purchaseAction';
import { fetchAllProducts } from '../../store/action/productAction';
import PurchaseTable from '../../shared/components/purchase/PurchaseTable';
import { preparePurchaseProductArray } from '../../shared/prepareArray/preparePurchaseArray';
import { decimalValidate, getFormattedMessage, placeholderText, onFocusInput, getFormattedOptions } from '../../shared/sharedMethod';
import { calculateCartTotalAmount, calculateCartTotalTaxAmount } from '../../shared/calculation/calculation';
import ModelFooter from '../../shared/components/modelFooter';
import ProductSearch from '../../shared/components/product-cart/search/ProductSearch';
import { addToast } from '../../store/action/toastAction';
import { paymentMethodOptions, purchasePaymentStatusOptions, purchaseStatusOptions, toastType } from '../../constants';
import ReactDatePicker from '../../shared/datepicker/ReactDatePicker';
import ProductMainCalculation from '../sales/ProductMainCalculation';
import ReactSelect from '../../shared/select/reactSelect';

const PurchaseForm = ( props ) => {
    const {
        addPurchaseData,
        id,
        editPurchase,
        customProducts,
        singlePurchase,
        warehouses,
        suppliers,
        fetchAllProducts,
        products, frontSetting, allConfigData
    } = props;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [ newCost, setNewCost ] = useState( '' );
    const [ newDiscount, setNewDiscount ] = useState( '' );
    const [ newTax, setNewTax ] = useState( '' );
    const [ newPurchaseUnit, setNewPurchaseUnit ] = useState( '' );
    const [ subTotal, setSubTotal ] = useState( '' );
    const [ updateProducts, setUpdateProducts ] = useState( [] );
    const [ quantity, setQuantity ] = useState( 0 );
    const [purchaseValueUpdated, setPurchaseValueUpdated] = useState(false);
    const [ purchaseValue, setPurchaseValue ] = useState( {
        date: new Date(),
        warehouse_id: '',
        supplier_id: '',
        tax_rate: '0.00',
        tax_amount: '0.00',
        discount: '0.00',
        shipping: '0.00',
        grand_total: '0.00',
        notes: '',
        status_id: { label: getFormattedMessage("status.filter.received.label"), value: 1 },
        payment_status: { label: getFormattedMessage("payment-status.filter.unpaid.label"), value: 2 },
        payment_type: { label: getFormattedMessage("cash.label"), value: 1 },
        partial_amount: '',
    });

    const [ errors, setErrors ] = useState( {
        date: '',
        warehouse_id: '',
        supplier_id: '',
        details: '',
        tax_rate: '',
        discount: '',
        shipping: '',
        status_id: '',
        partial_amount: ''
    } );

    useEffect(() => {
        if (singlePurchase && !purchaseValueUpdated) {
            setPurchaseValue({
                date: moment(singlePurchase.date).toDate(),
                warehouse_id: singlePurchase.warehouse_id,
                supplier_id: singlePurchase.supplier_id,
                tax_rate: singlePurchase.tax_rate.toFixed(2),
                tax_amount: singlePurchase.tax_amount.toFixed(2),
                discount: singlePurchase.discount.toFixed(2),
                shipping: singlePurchase.shipping.toFixed(2),
                grand_total: singlePurchase.grand_total,
                notes: singlePurchase.notes,
                status_id: singlePurchase.status_id || { label: getFormattedMessage("status.filter.received.label"), value: 1 },
                payment_status: singlePurchase.payment_status || { label: getFormattedMessage("payment-status.filter.unpaid.label"), value: 2 },
                payment_type: singlePurchase.payment_type || { label: getFormattedMessage("cash.label"), value: 1 },
                partial_amount: singlePurchase.partial_amount,
            });
    
            setUpdateProducts(singlePurchase.purchase_items || []);
            setPurchaseValueUpdated(true);
        }
    }, [singlePurchase]);

    useEffect( () => {
        setUpdateProducts( updateProducts );
    }, [ updateProducts, quantity, newCost, newDiscount, newTax, subTotal, newPurchaseUnit ] );

    useEffect( () => {
        updateProducts.length >= 1 ? dispatch( { type: 'DISABLE_OPTION', payload: true } ) : dispatch( { type: 'DISABLE_OPTION', payload: false } )
    }, [ updateProducts ] )

    useEffect( () => {
        purchaseValue.warehouse_id.value ? fetchAllProducts() : null
    }, [ purchaseValue.warehouse_id ] )

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        const qtyCart = updateProducts.filter( ( a ) => a.quantity === 0 );
        if ( !purchaseValue.date ) {
            error[ 'date' ] = getFormattedMessage( 'globally.date.validate.label' );
        } else if ( !purchaseValue.warehouse_id ) {
            errorss[ 'warehouse_id' ] = getFormattedMessage( 'product.input.warehouse.validate.label' )
        } else if ( !purchaseValue.supplier_id ) {
            errorss[ 'supplier_id' ] = getFormattedMessage( 'purchase.select.supplier.validate.label' )
        } else if ( qtyCart.length > 0 ) {
            dispatch( addToast( {
                text: getFormattedMessage( 'globally.product-quantity.validate.message' ),
                type: toastType.ERROR
            } ) )
        } else if ( updateProducts.length < 1 ) {
            dispatch( addToast( {
                text: getFormattedMessage( 'purchase.product-list.validate.message' ),
                type: toastType.ERROR
            } ) )
        } else if ( !purchaseValue.status_id ) {
            errorss[ 'status_id' ] = getFormattedMessage( 'globally.status.validate.label' )
        } else if ( purchaseValue?.payment_status?.value === 3 && !purchaseValue.partial_amount ) {
            errorss[ 'partial_amount' ] = getFormattedMessage( 'expense.input.amount.validate.label' )
        } else if ( purchaseValue?.payment_status?.value === 3 && parseFloat(purchaseValue.partial_amount) > parseFloat(calculateCartTotalAmount(updateProducts, purchaseValue)) ) {
            errorss[ 'partial_amount' ] = getFormattedMessage( 'paying-amount-validate-label' )
        } else {
            isValid = true;
        }
        setErrors( errorss );
        return isValid;
    };

    const onWarehouseChange = ( obj ) => {
        setPurchaseValue( inputs => ( { ...inputs, warehouse_id: obj } ) )
        setErrors( '' )
    };

    const onSupplierChange = ( obj ) => {
        setPurchaseValue( inputs => ( { ...inputs, supplier_id: obj } ) )
        setErrors( '' );
    };

    const onStatusChange = ( obj ) => {
        setPurchaseValue( inputs => ( { ...inputs, status_id: obj } ) )
    };

    const updateCost = ( item ) => {
        setNewCost( item );
    };

    const updateDiscount = ( item ) => {
        setNewDiscount( item );
    };

    const updateTax = ( item ) => {
        setNewTax( item );
    };

    const onChangeInput = ( e ) => {
        e.preventDefault();
        const { value } = e.target;
        // check if value includes a decimal point
        if ( value.match( /\./g ) ) {
            const [ , decimal ] = value.split( '.' );
            // restrict value to only 2 decimal places
            if ( decimal?.length > 2 ) {
                return;
            }
        }
        setPurchaseValue( inputs => ( { ...inputs, [ e.target.name ]: value && value } ) )
    };

    const onNotesChangeInput = ( e ) => {
        e.preventDefault();
        setPurchaseValue( inputs => ( { ...inputs, notes: e.target.value } ) )
    }

    const handleCallback = ( date ) => {
        setPurchaseValue( previousState => {
            return { ...previousState, date: date }
        } );
        setErrors( '' )
    };

    const updatedQty = ( qty ) => {
        setQuantity( qty );
    };

    const updateSubTotal = ( item ) => {
        setSubTotal( item );
    };

    const updatePurchaseUnit = ( item ) => {
        setNewPurchaseUnit( item );
    };

    const statusFilterOptions = getFormattedOptions( purchaseStatusOptions )
    const statusDefaultValue = statusFilterOptions.map( ( option ) => {
        return {
            value: option.id,
            label: option.name
        }
    } )

    const prepareData = ( prepareData ) => {
        const formValue = {
            date: moment( prepareData.date ).toDate(),
            warehouse_id: prepareData.warehouse_id.value ? prepareData.warehouse_id.value : prepareData.warehouse_id,
            supplier_id: prepareData.supplier_id.value ? prepareData.supplier_id.value : prepareData.supplier_id,
            discount: prepareData.discount,
            tax_rate: prepareData.tax_rate,
            tax_amount: calculateCartTotalTaxAmount( updateProducts, purchaseValue ),
            purchase_items: updateProducts,
            shipping: prepareData.shipping,
            grand_total: calculateCartTotalAmount( updateProducts, purchaseValue ),
            received_amount: '',
            paid_amount: '',
            payment_type: 0,
            notes: prepareData.notes,
            reference_code: '',
            status: prepareData.status_id.value ? prepareData.status_id.value : prepareData.status_id,
            payment_status: parseFloat(prepareData.partial_amount) == calculateCartTotalAmount(updateProducts, purchaseValue)
                            ? 1 : prepareData?.payment_status?.value
                            ? parseFloat(prepareData.partial_amount) == 0
                            ? 2 : prepareData?.payment_status?.value : prepareData?.payment_status,
            payment_type: parseFloat(prepareData.partial_amount) == 0
                            ? 0 : prepareData?.payment_status?.value === 2
                            ? 0 : prepareData?.payment_type?.value
                            ? prepareData?.payment_type?.value : prepareData?.payment_type,
            partial_amount: prepareData.partial_amount,
        }
        return formValue
    };

    const paymentStatusFilterOptions = getFormattedOptions( purchasePaymentStatusOptions )
    const paymentStatusDefaultValue = paymentStatusFilterOptions.map( ( option ) => {
        return {
            value: option.id,
            label: option.name
        }
    } );

    const paymentMethodOption = getFormattedOptions( paymentMethodOptions )
    const paymentTypeDefaultValue = paymentMethodOption.map( ( option ) => {
        return {
            value: option.id,
            label: option.name
        }
    } );

    const onPaymentStatusChange = ( obj ) => {
        setPurchaseValue( inputs => ( { ...inputs, payment_status: obj } ) );
        setPurchaseValue( input => ( { ...input, payment_type: { label: getFormattedMessage( "cash.label" ), value: 1 } } ) )
    };

    const onPaymentTypeChange = ( obj ) => {
        setPurchaseValue( inputs => ( { ...inputs, payment_type: obj } ) );
    };

    const onSubmit = ( event ) => {
        event.preventDefault();
        const valid = handleValidation();
        if ( valid ) {
            if ( singlePurchase ) {
                editPurchase( id, prepareData( purchaseValue ), navigate );
            } else {
                addPurchaseData( prepareData( purchaseValue ) );
                setPurchaseValue( purchaseValue );
            }
        }
    };

    const onBlurInput = ( el ) => {
        if ( el.target.value === '' ) {
            if ( el.target.name === 'shipping' ) {
                setPurchaseValue( { ...purchaseValue, shipping: '0.00' } )
            }
            if ( el.target.name === 'discount' ) {
                setPurchaseValue( { ...purchaseValue, discount: '0.00' } )
            }
            if ( el.target.name === 'tax_rate' ) {
                setPurchaseValue( { ...purchaseValue, tax_rate: '0.00' } )
            }
        }
    }

    return (
        <div className='card'>
            <div className='card-body'>
                <div className='row'>
                    <div className='col-md-4'>
                        <label className='form-label'>
                            {getFormattedMessage( 'react-data-table.date.column.label' )}:
                        </label>
                        <span className='required' />
                        <div className='position-relative'>
                            <ReactDatePicker onChangeDate={handleCallback} newStartDate={purchaseValue.date} />
                        </div>
                        <span className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'date' ] ? errors[ 'date' ] : null}</span>
                    </div>
                    <div className='col-md-4 mb-3'>
                        <ReactSelect data={warehouses} onChange={onWarehouseChange}
                            defaultValue={purchaseValue.warehouse_id} addSearchItems={singlePurchase}
                            isWarehouseDisable={true}
                            value={purchaseValue.warehouse_id}
                            title={getFormattedMessage( 'warehouse.title' )} errors={errors[ 'warehouse_id' ]}
                            placeholder={placeholderText( 'product.input.warehouse.placeholder.label' )} />
                    </div>
                    <div className='col-md-4 mb-3'>
                        <ReactSelect data={suppliers} onChange={onSupplierChange}
                            defaultValue={purchaseValue.supplier_id} value={purchaseValue.supplier_id}
                            title={getFormattedMessage( 'supplier.title' )} errors={errors[ 'supplier_id' ]}
                            placeholder={placeholderText( 'purchase.select.supplier.placeholder.label' )} />
                    </div>
                    <div className='col-md-12 mb-3'>
                        <label className='form-label'>
                            {getFormattedMessage( 'product.title' )}:
                        </label>
                        <ProductSearch values={purchaseValue} products={products} isAllProducts={true}
                            handleValidation={handleValidation} updateProducts={updateProducts}
                            setUpdateProducts={setUpdateProducts} customProducts={customProducts} />
                    </div>
                    <div className='col-12 md-12'>
                        <label
                            className='form-label'>
                            {getFormattedMessage( 'purchase.order-item.table.label' )}:
                        </label>
                        <span className='required ' />
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>{getFormattedMessage( 'product.title' )}</th>
                                    <th>{getFormattedMessage( 'globally.detail.net-unit-cost' )}</th>
                                    <th>{getFormattedMessage( 'purchase.order-item.table.stock.column.label' )}</th>
                                    <th className='text-lg-start text-center'>{getFormattedMessage( 'pos-qty.title' )}</th>
                                    <th>{getFormattedMessage( 'globally.detail.discount' )}</th>
                                    <th>{getFormattedMessage( 'globally.detail.tax' )}</th>
                                    <th>{getFormattedMessage( 'globally.detail.subtotal' )}</th>
                                    <th>{getFormattedMessage( 'react-data-table.action.column.label' )}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {updateProducts && updateProducts.map( ( singleProduct, index ) => {
                                    return <PurchaseTable singleProduct={singleProduct} index={index}
                                        updateQty={updatedQty}
                                        updateCost={updateCost} updateDiscount={updateDiscount}
                                        updateProducts={updateProducts}
                                        updateSubTotal={updateSubTotal} frontSetting={frontSetting}
                                        setUpdateProducts={setUpdateProducts} updateTax={updateTax}
                                        updatePurchaseUnit={updatePurchaseUnit}
                                        purchaseItem={singlePurchase && singlePurchase.purchase_items}
                                        warehouseName={purchaseValue?.warehouse_id?.label}
                                    />
                                } )}
                                {!updateProducts.length && <tr>
                                    <td colSpan={8} className='fs-5 px-3 py-6 custom-text-center'>
                                        {getFormattedMessage( 'sale.product.table.no-data.label' )}
                                    </td>
                                </tr>
                                }
                            </tbody>
                        </Table>
                    </div>
                    <div className='col-12'>
                        <ProductMainCalculation inputValues={purchaseValue} updateProducts={updateProducts}
                            frontSetting={frontSetting} allConfigData={allConfigData} />
                    </div>
                    <div className='col-md-4 mb-5'>
                        <label className='form-label'>
                            {getFormattedMessage( 'globally.detail.order.tax' )}:
                        </label>
                        <InputGroup>
                            <input aria-label='Dollar amount (with dot and two decimal places)'
                                className='form-control'
                                onBlur={( event ) => onBlurInput( event )}
                                onFocus={( event ) => onFocusInput( event )}
                                value={purchaseValue.tax_rate} type='text' name='tax_rate'
                                onKeyPress={( event ) => decimalValidate( event )}
                                onChange={( e ) => {
                                    onChangeInput( e )
                                }} />
                            <InputGroup.Text>%</InputGroup.Text>
                        </InputGroup>
                        <span className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'orderTax' ] ? errors[ 'orderTax' ] : null}</span>
                    </div>
                    <div className='col-md-4 mb-5'>
                        <label className='form-label'>
                            {getFormattedMessage( 'globally.detail.discount' )}:
                        </label>
                        <InputGroup>
                            <input aria-label='Dollar amount (with dot and two decimal places)'
                                className='form-control'
                                onBlur={( event ) => onBlurInput( event )}
                                onFocus={( event ) => onFocusInput( event )}
                                value={purchaseValue.discount} type='text' name='discount'
                                onKeyPress={( event ) => decimalValidate( event )}
                                onChange={( e ) => onChangeInput( e )}
                            />
                            <InputGroup.Text>{frontSetting.value && frontSetting.value.currency_symbol}</InputGroup.Text>
                        </InputGroup>
                        <span className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'discount' ] ? errors[ 'discount' ] : null}</span>
                    </div>
                    <div className='col-md-4 mb-5'>
                        <label
                            className='form-label'>
                            {getFormattedMessage( 'globally.detail.shipping' )}:
                        </label>
                        <InputGroup>
                            <input aria-label='Dollar amount (with dot and two decimal places)'
                                className='form-control' value={purchaseValue.shipping}
                                type='text' name='shipping'
                                onBlur={( event ) => onBlurInput( event )}
                                onFocus={( event ) => onFocusInput( event )}
                                onKeyPress={( event ) => decimalValidate( event )}
                                onChange={( e ) => onChangeInput( e )}
                            />
                            <InputGroup.Text>{frontSetting.value && frontSetting.value.currency_symbol}</InputGroup.Text>
                        </InputGroup>
                        <span className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'shipping' ] ? errors[ 'shipping' ] : null}</span>
                    </div>
                    <div className='col-md-4 mb-5'>
                        <ReactSelect multiLanguageOption={statusFilterOptions} onChange={onStatusChange} name='status'
                            title={getFormattedMessage( 'globally.detail.status' )}
                            value={purchaseValue.status_id} errors={errors[ 'status_id' ]}
                            defaultValue={statusDefaultValue[ 0 ]}
                            placeholder={getFormattedMessage( 'globally.detail.status' )} />
                    </div>
                    <div className='col-md-4'>
                        <ReactSelect multiLanguageOption={paymentStatusFilterOptions} onChange={onPaymentStatusChange} name='payment_status'
                            title={getFormattedMessage( 'globally.detail.payment.status' )}
                            value={purchaseValue.payment_status} 
                            errors={errors[ 'payment_status' ]}
                            defaultValue={paymentStatusDefaultValue[ 0 ]}
                            placeholder={placeholderText( 'sale.select.payment-status.placeholder' )} />
                    </div>
                    {purchaseValue?.payment_status?.value !== 2 && 
                    <div className='col-md-4'>
                        <ReactSelect title={getFormattedMessage( 'select.payment-type.label' )}
                            name='payment_type'
                            value={purchaseValue.payment_type} 
                            errors={errors[ 'payment_type' ]}
                            placeholder={placeholderText( 'sale.select.payment-type.placeholder' )}
                            defaultValue={paymentTypeDefaultValue[ 0 ]}
                            multiLanguageOption={paymentMethodOption}
                            onChange={onPaymentTypeChange}
                        />
                    </div>}
                    {purchaseValue?.payment_status?.value === 3 &&
                        <div className="col-md-4">
                            <label className="form-label">
                                {getFormattedMessage(
                                    "amount.title"
                                )}
                                :{" "}
                            </label>
                            <span className="required" />
                            <input
                                type="number"
                                name="partial_amount"
                                value={purchaseValue.partial_amount}
                                placeholder={placeholderText(
                                    "expense.input.amount.placeholder.label"
                                )}
                                className="form-control"
                                autoFocus={true}
                                onChange={(e) => onChangeInput(e)}
                            />
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["partial_amount"]
                                    ? errors["partial_amount"]
                                    : null}
                            </span>
                        </div>}
                    <div className='col-md-12 mb-5'>
                        <label className='form-label'>
                            {getFormattedMessage( 'globally.input.note.label' )}:
                        </label>
                        <textarea name='notes' className='form-control'
                            placeholder={placeholderText( 'globally.input.note.placeholder.label' )}
                            onChange={( e ) => onNotesChangeInput( e )}
                            value={purchaseValue.notes}
                        />
                        <span className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'notes' ] ? errors[ 'notes' ] : null}</span>
                    </div>
                    <ModelFooter onEditRecord={singlePurchase} onSubmit={onSubmit} link='/user/purchases' />
                </div>
            </div>
        </div>
    )
};

const mapStateToProps = ( state ) => {
    const { purchaseProducts, products, frontSetting, allConfigData } = state;
    return { customProducts: preparePurchaseProductArray( products ), purchaseProducts, products, frontSetting, allConfigData }
};

export default connect( mapStateToProps, { editPurchase, fetchAllProducts, searchPurchaseProduct, } )( PurchaseForm );

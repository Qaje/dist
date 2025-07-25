import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { InputGroup, Table } from 'react-bootstrap-v5';
import { searchPurchaseProduct } from '../../store/action/purchaseProductAction';
import { editPurchaseReturn } from '../../store/action/purchaseReturnAction';
import { fetchAllProducts, fetchProductsByWarehouse } from '../../store/action/productAction';
import PurchaseReturnTable from '../../shared/components/purchase/PurchaseTable';
import { preparePurchaseReturnArray } from './preparePurchaseReturnArray';
import { decimalValidate, getFormattedMessage, placeholderText, onFocusInput, getFormattedOptions } from '../../shared/sharedMethod';
import { calculateCartTotalAmount, calculateCartTotalTaxAmount, } from '../../shared/calculation/calculation';
import ModelFooter from '../../shared/components/modelFooter';
import ProductSearch from '../../shared/components/product-cart/search/ProductSearch';
import { addToast } from '../../store/action/toastAction';
import { saleStatusOptions, toastType } from '../../constants';
import ReactDatePicker from '../../shared/datepicker/ReactDatePicker';
import ProductMainCalculation from '../sales/ProductMainCalculation';
import ReactSelect from '../../shared/select/reactSelect';
const PurchaseReturnForm = ( props ) => {
    const { addPurchaseReturnData, id, editPurchaseReturn, customProducts, singlePurchase, warehouses, suppliers,
        fetchProductsByWarehouse, products, frontSetting, allConfigData, createSinglePurchase
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

    const [purchaseValue, setPurchaseValue] = useState({
        date: new Date(),
        warehouse_id: '',
        supplier_id: '',
        tax_rate: "0.00",
        tax_amount: '0.00',
        discount: "0.00",
        shipping: "0.00",
        grand_total: '0.00',
        notes: '',
        status_id: { label: getFormattedMessage("status.filter.received.label"), value: 1 },
    });

    useEffect(() => {
        if (singlePurchase && !purchaseValueUpdated) {
            const data = singlePurchase;
            setPurchaseValue({
                date: moment(data.date).toDate(),
                warehouse_id: data.warehouse_id,
                supplier_id: data.supplier_id,
                tax_rate: data.orderTax?.toFixed(2) || "0.00",
                tax_amount: data.tax_amount || '0.00',
                discount: data.discount?.toFixed(2) || "0.00",
                shipping: data.shipping?.toFixed(2) || "0.00",
                grand_total: data.grand_total || '0.00',
                notes: data.notes || '',
                status_id: data.status_id || { label: getFormattedMessage("status.filter.received.label"), value: 1 },
            });
            setUpdateProducts(data.purchase_return_items); 
            setPurchaseValueUpdated(true);
        }
    }, [singlePurchase]);

    useEffect(() => {
        if (createSinglePurchase && !purchaseValueUpdated) {
            const data = createSinglePurchase;
            setPurchaseValue({
                date: moment(data.date).toDate(),
                warehouse_id: data.warehouse_id,
                supplier_id: data.supplier_id,
                tax_rate: data.orderTax?.toFixed(2) || "0.00",
                tax_amount: data.tax_amount || '0.00',
                discount: data.discount?.toFixed(2) || "0.00",
                shipping: data.shipping?.toFixed(2) || "0.00",
                grand_total: data.grand_total || '0.00',
                notes: data.notes || '',
                status_id: data.status_id || { label: getFormattedMessage("status.filter.received.label"), value: 1 },
                purchase_id: data.purchase_id,
            });
            setUpdateProducts( data.purchase_return_items );
            setPurchaseValueUpdated(true);
        }
    }, [createSinglePurchase]);

    const [ errors, setErrors ] = useState( {
        date: '',
        warehouse_id: '',
        supplier_id: '',
        details: '',
        tax_rate: '',
        discount: '',
        shipping: '',
        status_id: ''
    } );

    // useEffect( () => {
    //     setUpdateProducts( updateProducts );
    // }, [ updateProducts, quantity, newCost, newDiscount, newTax, subTotal, newPurchaseUnit ] );

    useEffect( () => {
        updateProducts.length >= 1 ? dispatch( { type: 'DISABLE_OPTION', payload: true } ) : dispatch( { type: 'DISABLE_OPTION', payload: false } )
    }, [ updateProducts ] )

    useEffect( () => {
        purchaseValue.warehouse_id?.value ? fetchProductsByWarehouse( purchaseValue?.warehouse_id?.value ) : null
    }, [ purchaseValue.warehouse_id?.value] )

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        const hasValidQuantity = updateProducts.some(
            (product) => product.quantity > 0
        );

        if ( !purchaseValue.date ) {
            errorss[ 'date' ] = getFormattedMessage( 'globally.date.validate.label' );
        } else if ( !purchaseValue.warehouse_id ) {
            errorss[ 'warehouse_id' ] = getFormattedMessage( 'product.input.warehouse.validate.label' )
        } else if ( !purchaseValue.supplier_id ) {
            errorss[ 'supplier_id' ] = getFormattedMessage( 'purchase.select.supplier.validate.label' )
        } else if ( !hasValidQuantity ) {
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
            errorss[ 'status_id' ] = getFormattedMessage( "globally.status.validate.label" )
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

    const statusFilterOptions = getFormattedOptions( saleStatusOptions )
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
            purchase_return_items: updateProducts,
            shipping: prepareData.shipping,
            grand_total: calculateCartTotalAmount( updateProducts, purchaseValue ),
            received_amount: '',
            paid_amount: '',
            payment_type: 0,
            notes: prepareData.notes,
            reference_code: '',
            status: prepareData.status_id.value ? prepareData.status_id.value : prepareData.status_id,
            payment_status: 2,
            purchase_id: prepareData.purchase_id ? prepareData.purchase_id : '',
        }
        return formValue
    };

    const onSubmit = ( event ) => {
        event.preventDefault();
        const valid = handleValidation();
        if ( valid ) {
            if ( singlePurchase ) {
                editPurchaseReturn( id, prepareData( purchaseValue ), navigate );
            } else {
                addPurchaseReturnData( prepareData( purchaseValue ) );
                setPurchaseValue( purchaseValue );
            }
        }
    };

    const onBlurInput = ( el ) => {
        if ( el.target.value === '' ) {
            if ( el.target.name === "shipping" ) {
                setPurchaseValue( { ...purchaseValue, shipping: "0.00" } )
            }
            if ( el.target.name === "discount" ) {
                setPurchaseValue( { ...purchaseValue, discount: "0.00" } )
            }
            if ( el.target.name === "tax_rate" ) {
                setPurchaseValue( { ...purchaseValue, tax_rate: "0.00" } )
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
                    <div className='col-md-4 mb-5'>
                        <ReactSelect data={warehouses} onChange={onWarehouseChange}
                            defaultValue={purchaseValue.warehouse_id} addSearchItems={singlePurchase}
                            isWarehouseDisable={true}
                            value={purchaseValue.warehouse_id}
                            title={getFormattedMessage( 'warehouse.title' )} errors={errors[ 'warehouse_id' ]}
                            placeholder={placeholderText( 'product.input.warehouse.placeholder.label' )} />
                    </div>
                    <div className='col-md-4'>
                        <ReactSelect data={suppliers} onChange={onSupplierChange}
                            defaultValue={purchaseValue.supplier_id}
                            value={purchaseValue.supplier_id}
                            title={getFormattedMessage( 'supplier.title' )} errors={errors[ 'supplier_id' ]}
                            placeholder={placeholderText( 'purchase.select.supplier.placeholder.label' )} />
                    </div>
                    {!singlePurchase && !createSinglePurchase && <div className='col-md-12 mb-5'>
                        <label className='form-label'>
                            {getFormattedMessage( 'product.title' )}:
                        </label>
                        <ProductSearch values={purchaseValue} products={products} isAllProducts={true}
                            handleValidation={handleValidation} updateProducts={updateProducts}
                            setUpdateProducts={setUpdateProducts} customProducts={customProducts} />
                    </div>}
                    <div className='col-12 md-12'>
                        <label className='form-label'>
                            {getFormattedMessage( 'purchase.order-item.table.label' )}:
                        </label>
                        <span className='required ' />
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>{getFormattedMessage( 'product.title' )}</th>
                                    <th>{getFormattedMessage( 'globally.detail.net-unit-cost' )}</th>
                                    <th>{getFormattedMessage( 'purchase.order-item.table.stock.column.label' )}</th>
                                    <th>{getFormattedMessage( 'pos-qty.title' )}</th>
                                    <th>{getFormattedMessage( 'globally.detail.discount' )}</th>
                                    <th>{getFormattedMessage( 'globally.detail.tax' )}</th>
                                    <th>{getFormattedMessage( 'globally.detail.subtotal' )}</th>
                                    <th>{getFormattedMessage( 'react-data-table.action.column.label' )}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {updateProducts && updateProducts.map( ( singleProduct, index ) => {
                                    return <PurchaseReturnTable singleProduct={singleProduct} index={index}
                                        updateQty={updatedQty} updateProducts={updateProducts}
                                        updateCost={updateCost} updateDiscount={updateDiscount}
                                        updateSubTotal={updateSubTotal}
                                        frontSetting={frontSetting} updateTax={updateTax}
                                        setUpdateProducts={setUpdateProducts}
                                        updatePurchaseUnit={updatePurchaseUnit}
                                        purchaseItem={singlePurchase && singlePurchase.purchase_return_items}
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
                        <ProductMainCalculation inputValues={purchaseValue} allConfigData={allConfigData} updateProducts={updateProducts} frontSetting={frontSetting} />
                    </div>
                    <div className='col-md-4 mb-5'>
                        <label className='form-label'>
                            {getFormattedMessage( 'globally.detail.order.tax' )}:
                        </label>
                        <InputGroup>
                            <input aria-label='Dollar amount (with dot and two decimal places)'
                                value={purchaseValue.tax_rate} type='text' name='tax_rate'
                                onKeyPress={( event ) => decimalValidate( event )}
                                className='form-control'
                                onBlur={( event ) => onBlurInput( event )} onFocus={( event ) => onFocusInput( event )}
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
                                value={purchaseValue.discount} type='text' name='discount'
                                className='form-control'
                                onBlur={( event ) => onBlurInput( event )} onFocus={( event ) => onFocusInput( event )}
                                onKeyPress={( event ) => decimalValidate( event )}
                                onChange={( e ) => onChangeInput( e )}
                            />
                            <InputGroup.Text>{frontSetting.value && frontSetting.value.currency_symbol}</InputGroup.Text>
                        </InputGroup>
                        <span className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'discount' ] ? errors[ 'discount' ] : null}</span>
                    </div>
                    <div className='col-md-4 mb-5'>
                        <label className='form-label'>
                            {getFormattedMessage( 'globally.detail.shipping' )}:
                        </label>
                        <InputGroup>
                            <input aria-label='Dollar amount (with dot and two decimal places)'
                                type='text' value={purchaseValue.shipping} name='shipping'
                                className='form-control'
                                onBlur={( event ) => onBlurInput( event )} onFocus={( event ) => onFocusInput( event )}
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
                    <div className='col-md-12 mb-5'>
                        <label className='form-label'>
                            {getFormattedMessage( 'globally.input.note.label' )}:
                        </label>
                        <textarea name='notes' className='form-control' value={purchaseValue.notes}
                            placeholder={placeholderText( 'globally.input.note.placeholder.label' )}
                            onChange={( e ) => onNotesChangeInput( e )}

                        />
                        <span className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'notes' ] ? errors[ 'notes' ] : null}</span>
                    </div>
                    <ModelFooter onEditRecord={singlePurchase} onSubmit={onSubmit} link='/user/purchase-return' />
                </div>
            </div>
        </div>
    )
};

const mapStateToProps = ( state ) => {
    const { purchaseProducts, products, frontSetting, allConfigData } = state;
    return { customProducts: preparePurchaseReturnArray( products ), purchaseProducts, products, frontSetting, allConfigData, fetchAllProducts }
};

export default connect( mapStateToProps, { editPurchaseReturn, fetchProductsByWarehouse, searchPurchaseProduct, fetchAllProducts } )( PurchaseReturnForm );

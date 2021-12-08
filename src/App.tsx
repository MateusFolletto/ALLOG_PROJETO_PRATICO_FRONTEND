import React, { useEffect, useState } from 'react';
import api from './services/api';
import { MaskMoney, UnmaskMoney } from './utils/MaskMoney'
import { MaskNumber, UnmaskNumber } from './utils/MaskNumber'
import { ReactComponent as SvgPencil } from './icons/pencil-alt-solid.svg'
import { ReactComponent as SvgTrash } from './icons/trash-alt-solid.svg'
import './css/main.scss'

interface IProducts {
    id: number;
    no_codigo: number;
    tx_descricao: string;
    no_quantidade: number;
    no_valor: number;
}

function App() {
    const [getProducts, setProducts] = useState<Array<IProducts>>([]);
    const [getEditing, setEditing] = useState<number>(0);
    const [getCode, setCode] = useState<number>(0);
    const [getDescription, setDescription] = useState<string>("");
    const [getQuantity, setQuantity] = useState<number>(0);
    const [getValue, setValue] = useState<number>(0);
    const [getTotalValue, setTotalValue] = useState<string>("R$ 0,00");
    const [getLoading, setLoading] = useState<boolean>(true);

    function cancel(){
        setCode(0)
        setDescription("")
        setQuantity(0)
        setValue(0)
        setEditing(0)
        setLoading(false)
    }

    async function fetchProducts(){
        await api.get<Array<IProducts>>('/products').then(response => {
            setProducts(response.data)
            setLoading(false)
        });
    }

    async function createProduct() {
        setLoading(true)

        await api.post<Array<IProducts>>('/products',{
            no_codigo: UnmaskNumber(getCode),
            tx_descricao: getDescription,
            no_quantidade: UnmaskNumber(getQuantity),
            no_valor: UnmaskMoney(getValue)
        }).then(response => {
            cancel()
            fetchProducts()
        }).catch(error => {
            console.log(error)
            alert(error.response.data)
            setLoading(false)
        })
    }

    async function updateProduct() {
        setLoading(true)

        await api.put<Array<IProducts>>('/products/'+getEditing,{
            no_codigo: UnmaskNumber(getCode),
            tx_descricao: getDescription,
            no_quantidade: UnmaskNumber(getQuantity),
            no_valor: UnmaskMoney(getValue)
        }).then(response => {
            cancel()
            fetchProducts()
        }).catch(error => {
            console.log(error)
            alert(error.response.data)
            setLoading(false)
        })
    }

    async function deleteProduct(id: number){
        setLoading(true)

        await api.delete<Array<IProducts>>('/products/'+id,).then(response => {
            setLoading(false)
            fetchProducts()
        });
    }

    useEffect(() => {
        fetchProducts()
    }, []);

    useEffect(() => {
        if(UnmaskMoney(getValue) > 0 && UnmaskNumber(getQuantity) > 0){
            setTotalValue(MaskMoney((UnmaskMoney(getValue) * UnmaskNumber(getQuantity)), 'R$ '))
        }
        else{
            setTotalValue('R$ 0,00')
        }
    }, [getValue, getQuantity])

    return (
        <div className="App">
            { getLoading &&
                <div className="loading-screen">
                    
                </div>
            }
            <div className="container-app">
                <div className="container-header">
                    <span className="modal-title">
                        Cadastro de Produtos
                    </span>
                </div>
                <div className="container-body">
                    <div className="body-row">
                        <div className="container-field-1">
                            <label className="label-field">
                                Código
                            </label>
                            <input className="input-field"
                                value={MaskNumber(getCode)}
                                onChange={(e) => {
                                    setCode(e.target.value as unknown as number)
                                }}
                                maxLength={9}
                                placeholder="0"
                            />
                        </div>
                        <div className="container-field-1">
                            <label className="label-field">
                                Descrição
                            </label>
                            <input className="input-field"
                                value={getDescription}
                                onChange={(e) => {
                                    setDescription(e.target.value as unknown as string)
                                }}
                                placeholder="Insira o nome do produto"
                            />
                        </div>
                    </div>
                    <div className="body-row">
                        <div className="container-field-2">
                            <label className="label-field">
                                Quantidade
                            </label>
                            <input className="input-field"
                                value={MaskNumber(getQuantity)}
                                onChange={(e) => {
                                    setQuantity(e.target.value as unknown as number)
                                }}
                                maxLength={9}
                                placeholder="0"
                            />
                        </div>
                        <div className="container-field-2">
                            <label className="label-field">
                                Valor
                            </label>
                            <input className="input-field"
                                value={MaskMoney(getValue, 'R$ ')}
                                onChange={(e) => {
                                    setValue(e.target.value as unknown as number)
                                }}
                                placeholder="R$ 0,00"
                            />
                        </div>
                        <div className="container-field-2">
                            <label className="label-field">
                                Valor Total
                            </label>
                            <input className="input-field"
                                readOnly 
                                value={getTotalValue}
                                placeholder="R$ 0,00"
                            />
                        </div>
                    </div>
                    <div className="body-row">
                        <div className="container-button-group">
                            <button className="button-cadastro"
                                disabled={
                                    UnmaskNumber(getCode) > 0 &&
                                    getDescription &&
                                    UnmaskNumber(getQuantity) > 0 &&
                                    UnmaskMoney(getValue) > 0 ? 
                                    false : 
                                    true
                                }
                                onClick={() => {
                                    { getEditing > 0 ? updateProduct() : createProduct()}
                                }}
                            >
                                { getEditing > 0 ? "Salvar Alterações" : "Cadastrar Produto"}
                            </button>
                            <button className="button-cancelamento"
                                onClick={() => {
                                    setLoading(true)
                                    cancel()
                                }}
                            >
                                { getEditing > 0 ? "Cancelar" : "Limpar Campos"}
                            </button>
                        </div>
                    </div>
                    { getProducts.length > 0 &&
                        <div className="body-row">
                            <div className="container-table">
                                <table className="table-principal">
                                    <thead className="table-row-header">
                                        <tr className="table-row-content" key={'head'}>
                                            <th className="table-cell-header" key={1}>Código</th>
                                            <th className="table-cell-header" key={2}>Descrição</th>
                                            <th className="table-cell-header" key={3}>Quantidade</th>
                                            <th className="table-cell-header" key={4}>Valor unitário</th>
                                            <th className="table-cell-header" key={5}>Valor total</th>
                                            <th className="table-cell-header" key={6}/>
                                            <th className="table-cell-header" key={7}/>
                                        </tr>
                                    </thead>
                                    <tbody className="table-body">
                                    { getProducts.map(prod => (
                                        <tr className="table-row-content" key={'row-'+prod.no_codigo}>
                                            <td className="table-cell-content">{MaskNumber(prod.no_codigo)}</td>
                                            <td className="table-cell-content">{prod.tx_descricao}</td>
                                            <td className="table-cell-content">{MaskNumber(prod.no_quantidade)}</td>
                                            <td className="table-cell-content">{MaskMoney(prod.no_valor, 'R$ ')}</td>
                                            <td className="table-cell-content">{MaskMoney(prod.no_valor * prod.no_quantidade, 'R$ ')}</td>
                                            <td className="table-cell-content">
                                                <SvgPencil className="button-editar"
                                                    onClick={() => {
                                                        setEditing(prod.id)
                                                        setCode(prod.no_codigo)
                                                        setDescription(prod.tx_descricao)
                                                        setQuantity(prod.no_quantidade)
                                                        setValue(prod.no_valor)
                                                    }}
                                                />
                                            </td>
                                            <td className="table-cell-content">
                                                <SvgTrash className="button-excluir"
                                                    onClick={() => {
                                                        deleteProduct(prod.id)
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default App;
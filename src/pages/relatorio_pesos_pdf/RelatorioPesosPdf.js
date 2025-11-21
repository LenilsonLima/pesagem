import { Document, Page, Text, View, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Apis } from '../../Apis';
import { useParams } from 'react-router-dom';
import LoadingComponent from '../../components/LoadingComponent';

// Estilos otimizados para PDF
const styles = StyleSheet.create({
    viewer: {
        width: '100%',
        height: '100vh',
        minHeight: '500px'
    },
    page: {
        padding: 20,
        fontFamily: 'Helvetica'
    },
    area_header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    img: {
        width: 50,
        height: 50,
    },
    header: {
        alignItems: 'flex-start',
        rowGap: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 11,
        color: '#555',
    },
    caixa: {
        fontSize: 11,
        color: '#555',
        textTransform: 'uppercase'
    },
    table: {
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#f2f2f2'
    },
    tableRow: {
        flexDirection: 'row'
    },
    tableHeader: {
        backgroundColor: '#f2f2f2',
        fontWeight: 'bold',
        textAlign: 'left'
    },
    tableCell: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontSize: 10,
        width: '33.33%'
    },
    footer: {
        marginTop: 20,
        rowGap: 10,
        fontSize: 10,
        textAlign: 'right',
        color: '#666'
    }
});

const RelatorioPesosPdf = () => {
    const [dados, setDados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { caixa_id, data_inicial, data_final } = useParams();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('@pesa_box_token');
                if (!token) throw new Error('Token de autenticação não encontrado');
                const requestOptions = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        caixa_id: caixa_id,
                        data_inicial: data_inicial,
                        data_final: data_final
                    }
                }
                const response = await axios.get(Apis.urlPesoCaixaPDF, requestOptions);

                if (!response?.data?.registros) {
                    throw new Error('Estrutura de dados inválida na resposta');
                }

                setDados(response.data.registros);
            } catch (err) {
                console.error('Erro ao buscar dados:', err);
                setError(err.response.data.retorno.mensagem || 'Erro ao carregar dados');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    if (loading) {
        return (
            <LoadingComponent />
        );
    }

    if (error) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                color: 'red'
            }}>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div style={{ height: '100vh' }}>
            <PDFViewer style={styles.viewer}>
                <Document>
                    <Page size="A4" style={styles.page}>
                        <View style={styles.area_header}>
                            <View style={styles.header}>
                                <Text style={styles.title}>RELATÓRIO DE PESAGEM</Text>
                                <Text style={styles.subtitle}>
                                    Período: {String(data_inicial).split('-').reverse().join('/')} a {String(data_final).split('-').reverse().join('/')} | Emitido em: {new Date().toLocaleDateString('pt-BR')}
                                </Text>
                                <Text style={styles.caixa}>
                                    {dados[0]?.observacao}
                                </Text>
                            </View>
                            <Image source={'https://cdn-icons-png.flaticon.com/512/306/306688.png '} style={styles.img} />
                        </View>

                        <View style={styles.table}>
                            {/* Cabeçalho da tabela */}
                            <View style={[styles.tableRow, styles.tableHeader]}>
                                <Text style={styles.tableCell}>Nº</Text>
                                <Text style={styles.tableCell}>DATA</Text>
                                <Text style={styles.tableCell}>TIPO</Text>
                                <Text style={styles.tableCell}>PESO (g)</Text>
                            </View>

                            {/* Dados da tabela */}
                            {dados.map((item, index) => (
                                <View key={item.id} style={[styles.tableRow, { backgroundColor: index % 2 != 0 ? '#f2f2f2' : 'transparent', color: item.tipo_peso == 0 ? "#000" : "#cb2027" }]}>
                                    <Text style={styles.tableCell}>{String(index + 1).padStart(2, 0)}</Text>
                                    <Text style={styles.tableCell}>{String(item.criado_em).substring(0, 10).split('-').reverse().join('/')}</Text>
                                    <Text style={styles.tableCell}>{item.tipo_peso == 0 ? 'PESO' : 'COLETA'}</Text>
                                    <Text style={styles.tableCell}>{parseFloat(item.peso_atual).toFixed(3)}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.footer}>
                            <Text>Total de registros: {dados.length} | Peso médio: {
                                (dados.reduce((sum, item) => sum + parseFloat(item.peso_atual), 0) / dados.length).toFixed(2)
                            }g</Text>
                            <Text>Sistema de Pesagem | Relatório gerado automaticamente</Text>
                        </View>
                    </Page>
                </Document>
            </PDFViewer>
        </div>
    );
}
export default RelatorioPesosPdf;
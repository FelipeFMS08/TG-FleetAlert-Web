import React from "react";
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import { ReportsResponse } from "@/dto/responses/reports.response";
import { Button } from "../ui/button";

interface DownloadButtonProps {
    data: ReportsResponse;
}

const styles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        fontFamily: 'Times-Roman',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    author: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 40,
        fontStyle: 'italic',
    },
    subtitle: {
        fontSize: 18,
        marginVertical: 12,
        fontFamily: 'Times-Roman',
        borderBottom: '1px solid #ccc',
        paddingBottom: 5,
    },
    text: {
        margin: 12,
        fontSize: 14,
        textAlign: 'justify',
        fontFamily: 'Times-Roman',
        lineHeight: 1.6,
    },
    image: {
        marginVertical: 15,
        marginHorizontal: 100,
    },
    header: {
        fontSize: 12,
        marginBottom: 20,
        textAlign: 'center',
        color: 'grey',
        fontStyle: 'italic',
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
    },
    alertSection: {
        marginTop: 20,
    },
    alertText: {
        fontSize: 14,
        fontFamily: 'Times-Roman',
        marginBottom: 10,
        borderBottom: '1px solid #f4f4f4',
        paddingBottom: 5,
    },
    geofencingSection: {
        marginTop: 20,
    },
    geofencingText: {
        fontSize: 14,
        fontFamily: 'Times-Roman',
        marginBottom: 10,
    },
    summarySection: {
        marginTop: 30,
        padding: 10,
        backgroundColor: '#f4f4f4',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    summaryText: {
        fontSize: 16,
        fontFamily: 'Times-Roman',
        marginBottom: 8,
    },
    statusSection: {
        marginTop: 20,
        backgroundColor: '#e0e0e0',
        padding: 10,
        borderRadius: 5,
    },
    statusText: {
        fontSize: 14,
        fontFamily: 'Times-Roman',
        marginBottom: 10,
    },
    statusItem: {
        fontSize: 14,
        fontFamily: 'Times-Roman',
        marginBottom: 10,
    },
    separator: {
        marginVertical: 15,
        height: 1,
        backgroundColor: '#e0e0e0',
    }
});

const ReportPDF = ({ data }: { data: ReportsResponse }) => {
    const geofencingData = data.route.geofencinginfos
        ? `Geofencing Coordinates: ${data.route.geofencinginfos}`
        : "Nenhum geofencing disponível.";

    const renderAlerts = () => {
        if (data.route.alerts && data.route.alerts.length > 0) {
            return data.route.alerts.map((alert) => (
                <Text key={alert.id} style={styles.alertText}>
                    Alerta ID: {alert.id} - Localização: {alert.location}
                </Text>
            ));
        }
        return <Text style={styles.alertText}>Sem alertas registrados.</Text>;
    };

    const renderSummary = () => {
        return (
            <View style={styles.summarySection}>
                <Text style={styles.summaryText}>Resumo da Rota:</Text>
                <Text style={styles.summaryText}>
                    Início: {data.route.startAddress}
                </Text>
                <Text style={styles.summaryText}>
                    Destino: {data.route.finishAddress}
                </Text>
                <Text style={styles.summaryText}>
                    Usuário responsável: {data.route.user}
                </Text>
                <Text style={styles.summaryText}>
                    Veículo: {data.vehicle.name} ({data.vehicle.type})
                </Text>
                <Text style={styles.summaryText}>
                    Alertas: {data.route.alerts?.length}
                </Text>
            </View>
        );
    };

    return (
        <Document>
            <Page style={styles.body}>
                <Text style={styles.header} fixed>
                    Detalhes da rota de {data.route.user}
                </Text>
                <Text style={styles.title}>Relatório da Rota {data.route.name}</Text>
                <Text style={styles.author}>
                    Endereço Final (Aproximado): {data.route.finishAddress}
                </Text>

                {/* Imagem de veículo */}
                <Image style={styles.image} src="/undrawn-truck.png" />

                <View style={styles.separator} />

                {/* Capítulo para descrever o que está acontecendo */}
                <Text style={styles.subtitle}>Capítulo I: Detalhes da Rota</Text>

                <Text style={styles.text}>
                    A rota foi realizada com o veículo {data.vehicle.name} ({data.vehicle.type}).
                    O veículo iniciou o trajeto em {data.route.startAddress} e terminou em {data.route.finishAddress}.
                </Text>

                <Text style={styles.text}>
                    Usuário responsável pela rota foi: {data.route.user}.
                </Text>

                <Text style={styles.text}>
                    A rota foi projetada e criada por: {data.route.creator}.
                </Text>

                <View style={styles.separator} />

                {/* Exibindo alertas */}
                <View style={styles.alertSection}>
                    <Text style={styles.alertText}>Alertas para essa Rota:</Text>
                    {renderAlerts()}
                </View>

                {/* Número da página */}
                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>
            <Page style={styles.body}>
                {renderSummary()}

                <View style={styles.separator} />

                {/* Exibindo Status da Rota */}
                <View style={styles.statusSection}>
                    <Text style={styles.statusText}>
                        Status da Rota: <Text style={styles.statusItem}>{data.route.status === "FINISHED" ? "Rota Finalizada" : data.route.status === "STARED" ? "Em monitoramento" : "Aguardando Inicio de Rota"}</Text>
                    </Text>
                </View>

                {/* Número da página */}
                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>
        </Document>
    );
};

const DownloadButton = ({ data }: DownloadButtonProps) => (
    <Button>
        <PDFDownloadLink
            document={<ReportPDF data={data} />}
            fileName="relatorio.pdf"
        >
            <>
                {"Baixar Relatório"}
            </>
        </PDFDownloadLink>
    </Button>
);

export default DownloadButton;

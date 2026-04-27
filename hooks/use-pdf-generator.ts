import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Budget, BudgetItem } from '@/lib/types';

export function usePdfGenerator() {
  const generateBudgetPDF = async (budget: Budget, userName: string) => {
    try {
      // Criar conteúdo HTML do PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #2A9D76;
              padding-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              color: #2A9D76;
              font-size: 28px;
            }
            .header p {
              margin: 5px 0;
              color: #666;
            }
            .info-section {
              margin-bottom: 20px;
            }
            .info-section h3 {
              color: #2A9D76;
              font-size: 14px;
              margin: 10px 0 5px 0;
              text-transform: uppercase;
            }
            .info-section p {
              margin: 5px 0;
              font-size: 13px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            table th {
              background-color: #2A9D76;
              color: white;
              padding: 10px;
              text-align: left;
              font-size: 13px;
            }
            table td {
              padding: 10px;
              border-bottom: 1px solid #ddd;
              font-size: 12px;
            }
            table tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .total-section {
              text-align: right;
              margin-top: 20px;
              padding-top: 20px;
              border-top: 2px solid #2A9D76;
            }
            .total-section .total {
              font-size: 18px;
              font-weight: bold;
              color: #2A9D76;
              margin-top: 10px;
            }
            .status {
              display: inline-block;
              padding: 5px 10px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: bold;
              margin-top: 10px;
            }
            .status.pendente {
              background-color: #FEF3C7;
              color: #92400E;
            }
            .status.aprovado {
              background-color: #DCFCE7;
              color: #166534;
            }
            .status.recusado {
              background-color: #FEE2E2;
              color: #991B1B;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 11px;
              color: #999;
              border-top: 1px solid #ddd;
              padding-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ORÇAMENTO</h1>
            <p>Gerado por: ${userName}</p>
            <p>Data: ${new Date().toLocaleDateString('pt-BR')}</p>
          </div>

          <div class="info-section">
            <h3>Informações do Orçamento</h3>
            <p><strong>ID:</strong> ${budget.id.substring(0, 8).toUpperCase()}</p>
            <p><strong>Cliente:</strong> ${budget.client_id || 'Não especificado'}</p>
            <p><strong>Descrição:</strong> ${budget.description || 'Sem descrição'}</p>
            <p><strong>Data de Criação:</strong> ${new Date(budget.created_at).toLocaleDateString('pt-BR')}</p>
            <div class="status ${budget.status}">
              ${budget.status.toUpperCase()}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Descrição</th>
                <th style="text-align: center;">Quantidade</th>
                <th style="text-align: right;">Valor Unitário</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${(budget.budget_items || [])
                .map(
                  (item) => `
                <tr>
                  <td>${item.description}</td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right;">R$ ${(item.unit_price || 0).toFixed(2).replace('.', ',')}</td>
                  <td style="text-align: right;">R$ ${(item.total_price || 0).toFixed(2).replace('.', ',')}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          <div class="total-section">
            <p style="font-size: 14px; margin: 0;">Subtotal: R$ ${(
              (budget.budget_items || []).reduce((sum, item) => sum + (item.total_price || 0), 0) * 0.9
            )
              .toFixed(2)
              .replace('.', ',')}</p>
            <p style="font-size: 14px; margin: 5px 0;">Impostos (10%): R$ ${(
              (budget.budget_items || []).reduce((sum, item) => sum + (item.total_price || 0), 0) * 0.1
            )
              .toFixed(2)
              .replace('.', ',')}</p>
            <div class="total">
              Total: R$ ${(budget.budget_items || [])
                .reduce((sum, item) => sum + (item.total_price || 0), 0)
                .toFixed(2)
                .replace('.', ',')}
            </div>
          </div>

          <div class="footer">
            <p>Este orçamento foi gerado automaticamente pelo aplicativo ManoPro.</p>
            <p>Válido por 30 dias a partir da data de emissão.</p>
          </div>
        </body>
        </html>
      `;

      // Salvar arquivo HTML temporário
      const fileName = `orcamento_${budget.id.substring(0, 8)}_${Date.now()}.html`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(filePath, htmlContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Compartilhar arquivo
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: 'text/html',
          dialogTitle: `Orçamento - ${budget.client_id}`,
          UTI: 'com.apple.webarchive',
        });

        // Limpar arquivo após compartilhamento
        setTimeout(() => {
          FileSystem.deleteAsync(filePath).catch(() => {});
        }, 1000);
      } else {
        Alert.alert('Erro', 'Compartilhamento não disponível neste dispositivo');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao gerar PDF';
      Alert.alert('Erro', `Erro ao gerar PDF: ${errorMessage}`);
    }
  };

  return {
    generateBudgetPDF,
  };
}

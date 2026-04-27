import { Linking, Alert } from 'react-native';
import * as MailComposer from 'expo-mail-composer';
import { Budget } from '@/lib/types';

export function useShare() {
  const shareViaWhatsApp = async (phoneNumber: string, message: string) => {
    try {
      if (!phoneNumber) {
        Alert.alert('Erro', 'Número de telefone não disponível');
        return;
      }

      // Remover caracteres especiais do telefone
      const cleanPhone = phoneNumber.replace(/\D/g, '');

      // Criar URL do WhatsApp
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

      // Verificar se WhatsApp está instalado
      const canOpen = await Linking.canOpenURL(whatsappUrl);

      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        Alert.alert('Erro', 'WhatsApp não está instalado neste dispositivo');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao abrir WhatsApp');
    }
  };

  const shareViaEmail = async (email: string, subject: string, body: string) => {
    try {
      if (!email) {
        Alert.alert('Erro', 'E-mail não disponível');
        return;
      }

      const isAvailable = await MailComposer.isAvailableAsync();

      if (isAvailable) {
        await MailComposer.composeAsync({
          recipients: [email],
          subject,
          body,
          isHtml: true,
        });
      } else {
        // Fallback: abrir app de email padrão
        const mailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        await Linking.openURL(mailUrl);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao enviar e-mail');
    }
  };

  const shareBudgetViaWhatsApp = async (budget: Budget, phoneNumber: string, clientName: string) => {
    const total = (budget.budget_items || []).reduce((sum, item) => sum + (item.total_price || 0), 0);

    const message = `Olá ${clientName}! 👋\n\nSegue o orçamento solicitado:\n\n📋 *Orçamento ID:* ${budget.id.substring(0, 8).toUpperCase()}\n📝 *Descrição:* ${budget.description || 'Sem descrição'}\n💰 *Valor Total:* R$ ${total.toFixed(2).replace('.', ',')}\n📅 *Data:* ${new Date().toLocaleDateString('pt-BR')}\n\nPor favor, confirme se deseja prosseguir com este orçamento.\n\nAtenciosamente,\nManoPro 🔧`;

    await shareViaWhatsApp(phoneNumber, message);
  };

  const shareBudgetViaEmail = async (budget: Budget, email: string, clientName: string) => {
    const total = (budget.budget_items || []).reduce((sum, item) => sum + (item.total_price || 0), 0);

    const subject = `Orçamento - ${budget.id.substring(0, 8).toUpperCase()}`;

    const body = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <p>Olá ${clientName},</p>
          
          <p>Segue o orçamento solicitado:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #2A9D76; color: white;">
              <th style="padding: 10px; text-align: left;">Descrição</th>
              <th style="padding: 10px; text-align: center;">Quantidade</th>
              <th style="padding: 10px; text-align: right;">Valor Unitário</th>
              <th style="padding: 10px; text-align: right;">Total</th>
            </tr>
            ${(budget.budget_items || [])
              .map(
                (item) => `
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px;">${item.description}</td>
                <td style="padding: 10px; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; text-align: right;">R$ ${(item.unit_price || 0).toFixed(2).replace('.', ',')}</td>
                <td style="padding: 10px; text-align: right;">R$ ${(item.total_price || 0).toFixed(2).replace('.', ',')}</td>
              </tr>
            `
              )
              .join('')}
          </table>
          
          <div style="text-align: right; margin-top: 20px; padding-top: 20px; border-top: 2px solid #2A9D76;">
            <p style="font-size: 18px; font-weight: bold; color: #2A9D76;">
              Total: R$ ${total.toFixed(2).replace('.', ',')}
            </p>
          </div>
          
          <p>Por favor, confirme se deseja prosseguir com este orçamento.</p>
          
          <p>Atenciosamente,<br/>ManoPro 🔧</p>
          
          <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #999;">
            Este e-mail foi gerado automaticamente pelo aplicativo ManoPro.
          </p>
        </body>
      </html>
    `;

    await shareViaEmail(email, subject, body);
  };

  return {
    shareViaWhatsApp,
    shareViaEmail,
    shareBudgetViaWhatsApp,
    shareBudgetViaEmail,
  };
}

export function buildWhatsAppLink(whatsappNumber, { destination = "", travelDate = "", travellers = "", vehicle = "" } = {}) {
  const message = `Hello RANA Tour And Travels,
I would like to enquire about a trip.

Name:
Destination: ${destination}
Travel Date: ${travelDate}
Travellers: ${travellers}
Vehicle: ${vehicle}

Please share availability and quotation.`;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${whatsappNumber}?text=${encoded}`;
}

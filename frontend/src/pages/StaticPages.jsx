import StaticPage from "../components/StaticPage";

export function Privacy() {
  return (
    <StaticPage title="Privacy Policy">
      <p>Rana Tour And Travels collects only the information you provide when submitting an enquiry (name, phone, email, and trip details) in order to contact you about your travel request.</p>
      <p>We do not sell or share your personal information with third parties. Information is used solely to respond to your enquiry and manage your booking.</p>
      <p>This site does not process online payments and does not store payment information.</p>
      <p>For any privacy questions, please contact us directly by phone or WhatsApp.</p>
    </StaticPage>
  );
}

export function Terms() {
  return (
    <StaticPage title="Terms and Conditions">
      <p>By submitting an enquiry through this website, you agree that Rana Tour And Travels will contact you to discuss availability, itinerary and pricing for your requested trip.</p>
      <p>Submitting an enquiry does not constitute a confirmed booking. Bookings are confirmed manually by our team after discussing details with you.</p>
      <p>All pricing shared is on request and subject to change based on season, availability and requirements.</p>
      <p>This website does not process online payments at this time.</p>
    </StaticPage>
  );
}

export function Cancellation() {
  return (
    <StaticPage title="Cancellation Policy">
      <p>As bookings are confirmed manually and no online payment is collected through this website, cancellation terms will be discussed and agreed directly with our team at the time of booking confirmation.</p>
      <p>Please contact us by phone or WhatsApp as early as possible if you need to cancel or modify a trip.</p>
    </StaticPage>
  );
}

export function NotFound() {
  return (
    <div className="container-app py-24 text-center">
      <h1 className="font-display text-5xl font-bold text-navy mb-4">404</h1>
      <p className="text-navy/70 mb-6">Looks like you've taken a wrong turn.</p>
      <a href="/" className="btn-accent">Back to Home</a>
    </div>
  );
}

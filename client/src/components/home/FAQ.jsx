import { Accordion, AccordionDetails, AccordionSummary, Container, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const faqs = [
  {
    question: "How do I start a campaign?",
    answer: "Create an account, add your campaign details, set your goal and publish it after verification.",
  },
  {
    question: "Are donations secure?",
    answer: "Yes. Payments are processed through secure payment gateway integration.",
  },
  {
    question: "Can I track my donation?",
    answer: "Yes. Supporters can view donation history and campaign progress from their dashboard.",
  },
  {
    question: "Do campaigns get verified?",
    answer: "Campaign verification can be handled by admins before campaigns are promoted publicly.",
  },
];

const FAQ = () => {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 9 } }}>
      <Typography variant="h4" fontWeight={900} sx={{ textAlign: "center", mb: 4 }}>
        Frequently Asked Questions
      </Typography>
      {faqs.map((faq) => (
        <Accordion
          key={faq.question}
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "12px !important",
            mb: 1.5,
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={800}>{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">{faq.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
};

export default FAQ;
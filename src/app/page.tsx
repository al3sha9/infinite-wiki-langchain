import WikiPage from '@/components/WikiPage';

export default function Home() {
  const initialArticle = {
    title: "AI",
    content: `## Definition
**Artificial Intelligence (AI)** refers to the simulation of human intelligence in machines that are programmed to think and learn like humans. This technology encompasses a wide range of capabilities, including *natural language processing*, *machine learning*, and *computer vision*.

## Historical Development
The concept of AI has evolved significantly over the years:
- **Early Systems:** Simple rule-based programs
- **Modern Era:** Complex neural networks that can analyze vast amounts of data
- **Current State:** Real-time decision-making capabilities

## Applications
AI has the potential to transform various industries:
- **Healthcare:** Medical diagnosis and treatment optimization
- **Finance:** Algorithmic trading and fraud detection
- **Transportation:** Autonomous vehicles and traffic management
- **Technology:** Automation, efficiency improvements, and personalization

## Ethical Considerations
The rise of AI also raises important questions:
- Impact on **employment** and job displacement
- **Privacy** concerns and data security
- Need for responsible AI development and governance
- Ensuring **fairness** and avoiding algorithmic bias

## Future Outlook
As we continue to explore the possibilities of AI, it is crucial to strike a balance between **innovation** and ethical considerations to ensure that this powerful technology benefits all of **humanity**. The future of AI will likely involve greater integration with daily life, enhanced **decision-making** capabilities, and continued evolution toward more sophisticated forms of artificial **intelligence**.`
  };

  return <WikiPage initialArticle={initialArticle} />;
}

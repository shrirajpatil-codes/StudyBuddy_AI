// utils/aiResponses.js
// Generates realistic mock AI answers based on the selected mode.
// Replace this with a real API call (OpenAI, Gemini, Anthropic, etc.) later.

const DOUBT_RESPONSES = [
  `Great question! Let me break this down step by step:

**Key Concept:**
This is a fundamental topic in engineering. Here's how it works:

1. **First**, understand the underlying principle — every system follows certain physical/mathematical laws that govern its behaviour.
2. **Second**, apply the relevant formula or algorithm to the given problem.
3. **Third**, verify your answer by checking units and boundary conditions.

**Example:**
If you're dealing with circuit analysis, Kirchhoff's Voltage Law (KVL) states: *the sum of all voltages around a closed loop equals zero.*

**Tip:** Draw a diagram whenever possible — it makes complex problems 10× easier to visualize. 💡`,

  `Here's a clear explanation of your doubt:

The concept you're asking about connects to several important fundamentals. Let me explain using simple analogies:

Think of it like **water flowing through pipes** — voltage is the pressure, current is the flow rate, and resistance is the pipe diameter restricting flow. This is Ohm's Law in action: \`V = IR\`.

**Steps to solve this type of problem:**
- Identify all known and unknown variables
- Choose the appropriate formula
- Substitute and simplify
- Double-check your answer

Do you want me to walk through a specific numerical example? 🎯`,

  `Let me clarify this concept for you!

**Short Answer:** This works because of [the principle you're studying], which can be summarized as:
> *"For every action, there is an equal and opposite reaction."* — Newton's 3rd Law

**Detailed Explanation:**
In engineering applications, this principle translates to:
- Stress and strain in materials (Civil/Mechanical)
- Force and reaction in statics
- Signal and response in electronics

**Formula Reference:**
\`\`\`
F = ma         (Newton's 2nd Law)
τ = Iα         (Rotational equivalent)
V = L(di/dt)   (Inductor voltage)
\`\`\`

Need more examples or a practice problem? Ask away! 🚀`,
]

const EXAM_RESPONSES = [
  `📚 **Exam Prep: Complete Revision Notes**

Here's everything you need to know for your exam on this topic:

**Important Definitions:**
- **Term 1:** Clear, concise definition that could appear in a 2-mark question
- **Term 2:** Another key term with its engineering significance
- **Term 3:** Definition with real-world application

**High-Priority Formulas:**
\`\`\`
Formula 1:  P = VI           (Power)
Formula 2:  Z = √(R² + X²)  (Impedance)
Formula 3:  η = (P_out/P_in) × 100%  (Efficiency)
\`\`\`

**Likely Exam Questions:**
1. Derive the expression for [topic] — **5 marks** ⭐
2. Compare and contrast [A] vs [B] — **4 marks**
3. Numerical problem using the formula above — **6 marks** ⭐⭐

**Memory Tip:** Use the acronym **SOLVE** — State, Outline, List formula, Variables, Execute.

All the best! You've got this! 💪`,

  `🎯 **Quick Revision Sheet for Your Exam**

Based on previous year patterns, focus on these:

**Must-Know Topics (High Weightage):**
1. ✅ Fundamental theorems and their proofs
2. ✅ Numerical problem-solving techniques  
3. ✅ Comparison tables (great for 4-mark answers)
4. ✅ Applications in real-world scenarios

**Time Management Tips:**
- Allocate **40%** of time to high-weightage questions
- Attempt **confident answers first**
- Leave 10 minutes for revision

**Common Mistakes to Avoid:**
- Forgetting to mention units in numerical answers
- Skipping intermediate steps (examiner marks each step!)
- Not drawing diagrams when asked for explanation

You're well-prepared. Stay calm and trust your preparation! 🌟`,
]

const VIVA_RESPONSES = [
  `🎤 **Viva Practice: Likely Questions & Model Answers**

**Q1: Explain the working principle of [the topic you asked about].**
*Model Answer:* "The basic principle involves... [systematic 3-sentence explanation]. In practice, this is used in [application]. The key parameter to control is [parameter] because it directly affects [output]."

**Q2: What are the applications of this concept?**
*Model Answer:* List 3-4 applications confidently:
1. Power systems and energy conversion
2. Signal processing in communication
3. Control systems in automation
4. Embedded systems and IoT

**Q3: What happens if [condition] changes?**
*Model Answer:* "According to [formula/law], if [parameter] increases, then [effect] because [reason]. This is known as [principle name]."

**Quick Tips for Viva:**
- Speak slowly and clearly 🗣️
- If unsure, explain what you *do* know
- Use technical terms confidently
- Draw diagrams to support your answer

Would you like more questions on a specific sub-topic? 🎯`,

  `🎤 **Viva Q&A Session**

Here are 5 questions your examiner might ask, with sharp model answers:

**1. Define [the concept].**
> *"[Concept] is defined as... It was developed by [scientist] to explain [phenomenon]."*

**2. State the formula and explain each term.**
> *"The formula is V = IR, where V is voltage in volts, I is current in amperes, and R is resistance in ohms. This relationship is linear and holds for ohmic conductors."*

**3. What are the limitations?**
> *"The main limitations include: non-linearity at extreme conditions, temperature dependence, and frequency-dependent behaviour."*

**4. Give a real-world example.**
> *"A practical example is [example]. Here, [concept] is used to [achieve outcome]."*

**5. How does it differ from [related concept]?**
> *"While [A] deals with [property], [B] focuses on [different property]. The key distinction is [difference]."*

Practice saying these answers aloud — viva is all about confidence! 💯`,
]

/**
 * Returns a mock AI response string based on the current mode.
 * @param {string} text  — user's message
 * @param {string} mode  — 'doubt' | 'exam' | 'viva'
 */
export function generateAIResponse(text, mode = 'doubt') {
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

  if (mode === 'exam') return pick(EXAM_RESPONSES)
  if (mode === 'viva') return pick(VIVA_RESPONSES)
  return pick(DOUBT_RESPONSES)
}

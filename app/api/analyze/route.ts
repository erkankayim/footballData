import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const text = formData.get("text") as string | null;

    let contractText = "";

    if (file) {
      // Handle file upload
      if (file.type === "text/plain") {
        contractText = await file.text();
      } else if (file.type === "application/pdf") {
        // For now, return a message that PDF parsing needs to be implemented
        // In production, you'd use a library like pdf-parse
        return NextResponse.json(
          { error: "PDF parsing will be implemented. Please use text format for now." },
          { status: 400 }
        );
      }
    } else if (text) {
      contractText = text;
    } else {
      return NextResponse.json(
        { error: "No contract text provided" },
        { status: 400 }
      );
    }

    // Call Claude API for contract analysis
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `You are a contract analysis expert. Analyze the following contract and provide a comprehensive risk assessment.

Return your analysis in the following JSON format:
{
  "riskScore": <number between 0-100, where 100 is highest risk>,
  "findings": [
    {
      "title": "<Brief title of the issue>",
      "description": "<Detailed explanation of the issue>",
      "severity": "<high|medium|low>",
      "recommendation": "<Specific recommendation to address this issue>"
    }
  ],
  "summary": "<Plain English summary of what the contract means, key obligations, and overall assessment>"
}

Focus on:
1. Payment terms and conditions
2. Liability clauses
3. Intellectual property rights
4. Termination clauses
5. Non-compete or exclusivity terms
6. Indemnification requirements
7. Missing protections
8. Unusual or unfair terms

CONTRACT TEXT:
${contractText}

Provide only the JSON response, no additional text.`,
        },
      ],
    });

    // Parse Claude's response
    const responseText = message.content[0].type === "text"
      ? message.content[0].text
      : "";

    // Try to extract JSON from the response
    let analysis;
    try {
      // Remove markdown code blocks if present
      const jsonText = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      analysis = JSON.parse(jsonText);
    } catch (parseError) {
      // If JSON parsing fails, create a structured response from the text
      analysis = {
        riskScore: 50,
        findings: [
          {
            title: "Analysis Complete",
            description: responseText,
            severity: "medium",
            recommendation: "Review the full analysis and consult with legal counsel if needed.",
          },
        ],
        summary: "Contract analysis has been completed. Please review the findings above.",
      };
    }

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Error analyzing contract:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze contract" },
      { status: 500 }
    );
  }
}

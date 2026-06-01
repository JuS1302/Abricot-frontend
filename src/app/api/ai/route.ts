import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

// Génère des suggestions de tâches à partir d'un prompt utilisateur et du contexte projet
export async function POST(request: NextRequest) {
  try {
    const { prompt, projectName, projectDescription } = await request.json()

    const completion = await client.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: `Tu es un assistant de gestion de projet. L'utilisateur travaille sur le projet "${projectName}"${projectDescription ? ` : ${projectDescription}` : ''}.
À partir de sa description, génère une liste de tâches structurées.
Réponds UNIQUEMENT avec un tableau JSON valide, sans texte avant ou après, sans balises markdown.
Format attendu : [{ "title": "Titre court et actionnable", "description": "Description concise de la tâche" }]
Maximum 5 tâches.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const content = completion.choices[0].message.content ?? '[]'

    // Nettoie les éventuelles balises markdown que le modèle pourrait ajouter
    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    const tasks = JSON.parse(cleaned)
    return NextResponse.json({ tasks })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[AI route error]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

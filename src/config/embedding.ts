import { pipeline } from "@huggingface/transformers";
import * as tf from "@tensorflow/tfjs-node";

let embedder: any; // Change to a more specific type if possible

async function initializeEmbedder(): Promise<void> {
  if (!embedder) {
    embedder = await pipeline(
      "feature-extraction",
      "sentence-transformers/all-MiniLM-L6-v2"
    );
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  await initializeEmbedder();

  // Generate embedding
  const embeddings = await embedder(text);

  // Log the raw embeddings output
  console.log("Embeddings output:", embeddings);

  // Check if the embeddings are structured correctly
  if (
    !Array.isArray(embeddings) ||
    embeddings.length === 0 ||
    !Array.isArray(embeddings[0])
  ) {
    throw new Error("Invalid embedding structure received");
  }

  // Convert the tensor to a flat array
  const flatEmbedding = tf.tensor(embeddings[0]).arraySync() as number[];

  return flatEmbedding;
}

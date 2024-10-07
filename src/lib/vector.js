import {apiKey,supabaseKey,supabaseUrl} from './cred'
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Mistral } from '@mistralai/mistralai';
import { createClient } from "@supabase/supabase-js";

const client = new Mistral({apiKey});
const supabase = createClient(supabaseUrl, supabaseKey);

async function splitDocument(path) {
    const response = await fetch('science.txt');
    const text = await response.text();
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 250,
        chunkOverlap: 40
    });
    const output = await splitter.createDocuments([text]);
    const textArr = output.map(chunk => chunk.pageContent);
    return textArr;
}


async function createEmbeddings(chunks) {
    const embeddings = await client.embeddings.create({
        model: 'mistral-embed',
        inputs: chunks,
      });
    console.log(embeddings)
    const data = chunks.map((chunk, i) => {
        return {
            content: chunk,
            embedding: embeddings.data[i].embedding
        }
    });
    return data;
}

export const getData = async () => {
    const handbookChunks = await splitDocument();
    const data = await createEmbeddings(handbookChunks);
    let res = await supabase.from('handbook_docs').insert(data);
    console.log({res})
}


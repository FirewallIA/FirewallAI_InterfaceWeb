import path from "path";
import * as grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin vers ton mcp.proto
const PROTO_PATH = path.join(__dirname, "protos", "mcp.proto");

// Charger la définition du .proto
// Note : includeDirs permet de résoudre l'import "firewall.proto" présent dans mcp.proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true, // Garde les noms exacts (prompt_text, final_result, etc.)
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
  includeDirs: [
    path.join(__dirname, "protos"), 
    "node_modules/google-proto-files"
  ],
});

// Charger le package "firewall"
const mcpProto = (grpc.loadPackageDefinition(packageDefinition) as any).firewall;

export class MCPClient {
  private client: any;

  constructor(
    address: string = process.env.MCP_GRPC_ADDR || "[::1]:50051", // Remplace par l'IP/Port de ton serveur MCP
    creds: grpc.ChannelCredentials = grpc.credentials.createInsecure()
  ) {
    this.client = new mcpProto.MCPService(address, creds);
  }

  /**
   * Ouvre un flux bidirectionnel (Chat) avec le serveur MCP.
   * Retourne un objet de type ClientDuplexStream.
   */
  public chatStream(): grpc.ClientDuplexStream<any, any> {
    return this.client.Chat();
  }
}
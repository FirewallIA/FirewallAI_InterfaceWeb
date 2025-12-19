// server/firewall_client.ts
import path from "path";
import * as grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, "protos", "firewall.proto");

// Charger la définition du .proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
  includeDirs: ["node_modules/google-proto-files"], // utile si Empty est utilisé
});

// Charger le package
const firewallProto = (grpc.loadPackageDefinition(packageDefinition) as any).firewall;

export class FirewallClient {
  private client: any;

  constructor(
    address: string = process.env.FIREWALL_GRPC_ADDR || "[::1]:50051",
    creds: grpc.ChannelCredentials = grpc.credentials.createInsecure()
  ) {
    this.client = new firewallProto.FirewallService(address, creds);
  }

  getStatus(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.GetStatus({}, (err: any, response: any) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }

  listRules(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.ListRules({}, (err: any, response: any) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }

  createRule(rule: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.CreateRule({ rule }, (err: any, response: any) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }

  deleteRule(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.DeleteRule({ rule: { id } }, (err: any, response: any) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }

  updateRule(id: number, rule: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.UpdateRule({ id, rule }, (err: any, response: any) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  } 
 
  getTrafficStats(timeRange: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // Attention: La clé doit correspondre au nom dans le .proto (time_range)
      this.client.GetTrafficStats({ time_range: timeRange }, (err: any, response: any) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }

}

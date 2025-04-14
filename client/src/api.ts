import { TheLeaderboard, UserProfile, Entry, PublicEntry } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://einstaklingsverkefni-95p0.onrender.com";

export class DiaryApi {
    async fetchFromApi<T>(url: string): Promise<T | null> {  
        let response: Response | undefined;
        try {
            response = await fetch(url, {
                credentials: "include",
            });
        } catch (e) {
            console.error("error fetching from api",url, e);
            return null;
        }

        if(!response.ok) {
            console.error("non 2xx status from API", url);
            return null;
        }

        let json: unknown;
        try {
            json = await response.json();
        } catch(e) {
            console.error("error parsing json",url, e);
            return null;
        }

        return json as T;
    }

    async postToApi<T>(url: string, data: unknown): Promise<T | null> {
        let response: Response | undefined;
      
        try {
          response = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
        } catch (err) {
          console.error("POST fetch error", url, err);
          return null;
        }
      
        if (!response.ok) {
          const errorText = await response.text();
          console.error("POST failed with status", response.status, errorText);
          return null;
        }
      
        try {
          const json = await response.json();
          return json as T;
        } catch (err) {
          console.error("Error parsing POST response", url, err);
          return null;
        }
      }
      

    async getLeaderboard(): Promise<TheLeaderboard[] | null> {
        const url = BASE_URL + `/leaderboard`;

        const response = await this.fetchFromApi<TheLeaderboard[] | null>(url);

        return response;
    }

    async getMyEntries(): Promise<Entry[] | null> {
        const url = BASE_URL + `/entries/me`;
      
        const response = await this.fetchFromApi<Entry[] | null>(url);
      
        return response;
    }

    async getPublicEntries(): Promise<PublicEntry[] | null> {
        const url = BASE_URL + `/entries/public`;
        return this.fetchFromApi<PublicEntry[] | null>(url);
      }

    async getMyProfile(): Promise<UserProfile | null> {
        const url = BASE_URL + `/my-profile`;
        return this.fetchFromApi<UserProfile | null>(url);
      }
      


    async postSignup(username: string, password: string): Promise<boolean> {
        const url = BASE_URL + `/auth/register`;
      
        const response = await this.postToApi<{ message: string }>(url, {
          username,
          password,
        });
      
        return response !== null;
      }

    async postSignin(username: string, password: string): Promise<boolean> {
        const url = BASE_URL + `/auth/login`;

        const response = await this.postToApi<{ message: string }>(url, {
          username,
          password,
        });
      
        return response !== null;
    }


    async postSignout(): Promise<boolean> {
        const url = BASE_URL + `/auth/logout`;

        const response = await this.postToApi<{ message: string }>(url, {});
      
        return response !== null;
    }
    
    async postEntry(title: string, content: string, isPublic: boolean): Promise<boolean> {
        const url = BASE_URL + `/entries`;
      
        const response = await this.postToApi<{ message: string }>(url, {
          title,
          content,
          is_public: isPublic,
        });
      
        return response !== null;
      }


    async getGivenPoints(): Promise<number[] | null> {
        const url = `${BASE_URL}/entries/given`;
        return this.fetchFromApi<number[] | null>(url);
    }
      
    

    async givePoint(entryId: number):  Promise<boolean> {
        const url = BASE_URL + `/entries/${entryId}/give-point`;

        const response = await this.postToApi<{message: string}>(url, {});

        return response !== null;
    }

    async removePoint(entryId: number): Promise<boolean> {
        const url = BASE_URL + `/entries/${entryId}/remove-point`;
      
        const response = await this.postToApi<{ message: string }>(url, {});
      
        return response !== null;
      }
      
      
      
}
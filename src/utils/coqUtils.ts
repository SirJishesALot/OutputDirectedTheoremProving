export function normalizeGoals(res: any): any[] | null {
        console.log(res); 
        let data = res?.val !== undefined ? res.val : res;
        
        // Handle new GoalsWithMessages structure
        if (data && typeof data === 'object' && !Array.isArray(data) && 'goals' in data) {
            // This is GoalsWithMessages, extract just the goals
            data = data.goals;
        }
        
        if (data && typeof data === 'object' && !Array.isArray(data) && data.message && typeof data.message === 'string') {
            try {
                const parsed = JSON.parse(data.message);
                if (Array.isArray(parsed)) {
                    data = parsed;
                }
            } catch (e) { }
        }
        if (typeof data === 'string') {
            try { data = JSON.parse(data); } catch { return null; }
        }
        if (!Array.isArray(data)) return null;
        if (data.length > 0 && Array.isArray(data[0]) && data[0].length === 2 && Array.isArray(data[0][1])) {
            return data.flatMap((tuple: any) => tuple[1]);
        } return data;
    }
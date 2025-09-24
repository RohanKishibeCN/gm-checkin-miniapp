/**
 * API endpoint for Farcaster Quick Auth user information
 * This would typically be deployed to Vercel, Netlify, or similar
 */

import { createClient, Errors } from '@farcaster/quick-auth';

const client = createClient();

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get authorization header
        const authorization = req.headers.authorization;
        if (!authorization || !authorization.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing or invalid authorization header' });
        }

        // Extract token
        const token = authorization.split(' ')[1];

        // Verify JWT token
        const payload = await client.verifyJwt({
            token,
            domain: process.env.DOMAIN || 'localhost:8000'
        });

        // Get user FID from token
        const fid = payload.sub;

        // Resolve user information
        const user = await resolveUser(fid);

        return res.status(200).json(user);

    } catch (error) {
        console.error('Error in /api/me:', error);

        if (error instanceof Errors.InvalidTokenError) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        return res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * Resolve user information from FID
 */
async function resolveUser(fid) {
    try {
        // Get primary address from Farcaster API
        const primaryAddress = await getPrimaryAddress(fid);
        
        // Get user profile from Neynar (optional)
        const profile = await getUserProfile(fid);

        return {
            fid: parseInt(fid),
            primaryAddress,
            username: profile?.username || `user${fid}`,
            displayName: profile?.displayName || `User ${fid}`,
            avatar: profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fid}`,
            bio: profile?.bio || '',
            followerCount: profile?.followerCount || 0,
            followingCount: profile?.followingCount || 0
        };
    } catch (error) {
        console.error('Error resolving user:', error);
        
        // Return minimal user info if external APIs fail
        return {
            fid: parseInt(fid),
            username: `user${fid}`,
            displayName: `User ${fid}`,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fid}`
        };
    }
}

/**
 * Get primary Ethereum address for a FID
 */
async function getPrimaryAddress(fid) {
    try {
        const response = await fetch(
            `https://api.farcaster.xyz/fc/primary-address?fid=${fid}&protocol=ethereum`
        );

        if (response.ok) {
            const data = await response.json();
            return data.result?.address?.address;
        }
    } catch (error) {
        console.error('Error getting primary address:', error);
    }
    
    return null;
}

/**
 * Get user profile from Neynar API
 */
async function getUserProfile(fid) {
    try {
        if (!process.env.NEYNAR_API_KEY) {
            return null;
        }

        const response = await fetch(
            `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.NEYNAR_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.ok) {
            const data = await response.json();
            const user = data.users?.[0];
            
            if (user) {
                return {
                    username: user.username,
                    displayName: user.display_name,
                    avatar: user.pfp_url,
                    bio: user.profile?.bio?.text || '',
                    followerCount: user.follower_count || 0,
                    followingCount: user.following_count || 0
                };
            }
        }
    } catch (error) {
        console.error('Error getting user profile from Neynar:', error);
    }
    
    return null;
}
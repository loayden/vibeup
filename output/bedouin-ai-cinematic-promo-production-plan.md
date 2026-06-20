# Bedouin White Party AI Cinematic Promo Production Plan

## Objective
Create a 20-second vertical 9:16 Instagram Story advertisement with ultra-realistic luxury beach event visuals, using the Bedouin White Party poster imagery as visual reference.

## Recommended Model Path
Primary: `bytedance/seedance-2.0/reference-to-video`

Reason: supports multiple reference images, 9:16, 1080p, 4-15 second generations, and cinematic camera control. The final 20s spot should be built from four generated 5s clips, then edited locally with clean typography, music, color grade, and export settings.

Fallback: `fal-ai/kling-video/v3/standard/image-to-video`

Reason: strong image-to-video motion and cinematic visuals, but higher visible pricing at approximately $0.14/sec.

## Reference Images
Use these local references after user approval to upload them to Fal CDN:

1. `/Users/shereenmagdy/Downloads/WhatsApp Image 2026-06-04 at 03.25.23.jpeg`
   - Main brand and venue reference: Bedouin logo, stage, crowd, carpets, tents, sunset.

2. `/Users/shereenmagdy/Downloads/fd28542c-ee9b-42db-bcf2-fea1d60b078e.png`
   - Luxury venue layout reference: white tents, lanterns, Turkish carpets, beachfront warm lighting.

3. `/Users/shereenmagdy/Downloads/Gemini_Generated_Image_lxmspmlxmspmlxms.png`
   - Arrival scene reference: palm trees, premium white styling, golden sunset, luxury entrance.

4. `/Users/shereenmagdy/Downloads/ChatGPT Image Jun 6, 2026, 06_25_12 AM.png`
   - Vertical beach crowd reference: sunset party atmosphere and white dress code.

5. `/Users/shereenmagdy/Downloads/ChatGPT Image Jun 6, 2026, 06_24_10 AM.png`
   - Luxury arrival/automotive/event entrance mood reference.

## Production Strategy
Generate four 5-second reference-to-video clips:

1. Drone reveal over ocean and full venue.
2. Guest arrival and luxury carpet walkway.
3. DJ, crowd, lanterns, sofas, tents, fire effects, hospitality cuts.
4. Hero venue climax and aerial pullback.

Then locally assemble:

- 20-second timeline at 1080x1920, 30fps
- Premium black/gold color grade
- Clean post-production text overlays
- Luxury ambient/music layer
- Final H.264/AAC Instagram-ready export

## Master Negative Prompt
No misspelled text, no fake readable text in the scene, no distorted faces, no deformed hands, no blurry faces, no duplicated people, no melted crowd, no warped stage, no bad anatomy, no extra limbs, no AI artifacts, no low resolution, no shaky camera, no harsh fast transitions, no oversaturated colors, no cartoon style, no CGI plastic skin, no unrealistic ocean, no flickering lights, no watermark, no logo distortion.

## Clip 1 Prompt: 0-5s
Use @Image1, @Image2, and @Image4 as the visual references for the Bedouin White Party luxury beachfront venue, brand mood, white dress code, Turkish carpets, palm trees, warm lanterns, and golden sunset.

Ultra-realistic cinematic drone shot over a calm ocean at golden sunset. The camera glides forward toward a massive luxury beachfront event venue filled with thousands of elegant guests dressed entirely in white. Palm trees are illuminated by warm amber lights. White tents, umbrellas, Turkish carpets, glowing lanterns, luxury lounge sofas, and a large premium concert stage are visible. Rich golden reflections shimmer on the sea. Expensive commercial look, Aman Resort luxury, Saint-Tropez beach club, Mykonos sunset party, Vogue editorial photography, natural skin tones, realistic crowd behavior, cinematic depth of field, smooth drone motion, no shaky camera.

No in-scene readable text. Text will be added in post-production.

## Clip 2 Prompt: 5-10s
Use @Image1, @Image3, and @Image5 as references for the luxury arrival mood, palm-lined entrance, white outfits, warm lighting, and premium hospitality.

Ultra-realistic gimbal tracking shot of elegant guests walking down a luxurious carpet pathway toward the beachfront stage. Everyone is dressed in refined white outfits. Flowing white dresses move naturally in the ocean breeze. Champagne glasses catch golden sunlight. Warm sunset reflects off the sea in the background. Lanterns glow beside the carpet path, white tents and lounge seating frame the walkway. Slow, elegant cinematic motion, premium hospitality campaign, natural human movement, beautiful skin tones, shallow depth of field, smooth high-end commercial camera.

No in-scene readable text. Text will be added in post-production.

## Clip 3 Prompt: 10-15s
Use @Image1 and @Image2 as references for the crowd, stage, carpets, tents, lanterns, and luxury beach party atmosphere.

Ultra-realistic cinematic luxury event montage in one smooth sequence: DJ performing on a large illuminated stage, crowd dancing in white outfits, lanterns glowing, white umbrellas and premium sofas, friends celebrating with champagne, subtle fire effects near the stage, sunset over the beach, staff serving premium hospitality moments. Energy rises, music festival atmosphere becomes more powerful but still elegant and luxury. Detailed stage lighting, realistic crowd behavior, premium black and gold color grade, cinematic light rays, golden particles in the air, smooth camera movement, no chaotic cuts.

No in-scene readable text. Text will be added in post-production.

## Clip 4 Prompt: 15-20s
Use @Image1, @Image2, and @Image4 as references for the full venue, crowd, ocean, stage, palm trees, white tents, and sunset.

Ultra-realistic hero shot of the entire luxury beachfront venue. The stage lights activate, the crowd raises hands together, warm lanterns and palm trees glow, golden particles and cinematic light rays fill the atmosphere. Camera slowly rises and pulls back into a smooth aerial view showing ocean, palm trees, stage, crowd, white tents, Turkish carpets, and sunset in one frame. Exclusive world-class luxury event atmosphere, Hollywood commercial quality, rich golden light, premium editorial finish, smooth drone pullback.

No in-scene readable text. Text will be added in post-production.

## Post-Production Text Overlay
Add typography locally, not inside the AI generation:

- 0-4s: BEDOUIN / WHITE PARTY
- 4-8s: SEPTEMBER 19 & 20
- 8-13s: THE BIGGEST WHITE PARTY OF THE YEAR
- 17-20s: BEDOUIN / WHITE PARTY / SEPTEMBER 19 & 20 / COMING SOON

## Export Specs
- 1080x1920
- 20 seconds
- 30fps
- H.264 High Profile
- AAC 48k
- Instagram Story/Reels compatible

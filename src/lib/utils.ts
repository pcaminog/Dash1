import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import type { checkUrlType } from './types';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const toast_error_style =
	'border: 1px solid #000000; padding: 16px; color: #fff; background: #c13333; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);';

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

export const userAgent =
	'Mon1tor Notifier Bot Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36';

export async function checkUrl(data: checkUrlType) {
	// Prepare headers
	let headers = new Headers();

	// Prepare fetch options
	let options: RequestInit = {
		method: data.method,
		headers: headers,
		redirect: data.follow_redir ? 'follow' : 'manual'
	};

	if (data.req_headers && data.req_headers.length > 0) {
		data.req_headers.forEach((header) => {
			if (header.name && header.value) {
				headers.append(header.name, header.value);
			}
		});
	}

	// If authentication is provided, add it to headers
	if (data.authentication && data.authentication.name && data.authentication.value) {
		if (data.authentication.name !== '' && data.authentication.value !== '') {
			headers.append(data.authentication.name, data.authentication.value);
		}
	}
	try {
		let response = await fetch(data.url, options);
		return { success: true, message: response.status };
	} catch (err: any) {
		let customMessage = '';
		if (err.message.includes('Cannot use relative URL')) {
			customMessage = 'Invalid URL provided. Please provide a valid, absolute URL.';
		} else if (err.message.includes('use `event.fetch` instead')) {
			customMessage = 'Please use `event.fetch` instead of global fetch.';
		} else {
			console.log(err.message);
			customMessage = 'An error occurred. Please try again.';
		}
		return { success: false, message: customMessage };
	}
}


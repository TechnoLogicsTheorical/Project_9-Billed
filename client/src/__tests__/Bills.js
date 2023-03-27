/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect.js';

import BillsUI from '../views/BillsUI.js';
import { bills } from '../fixtures/bills.js';
import { ROUTES_PATH } from '../constants/routes.js';
import { localStorageMock } from '../__mocks__/localStorage.js';

import router from '../app/Router.js';
import Bills from '../containers/Bills.js';
import { ROUTES } from '../constants/routes.js';
import userEvent from '@testing-library/user-event';

describe('Given I am connected as an employee', () => {
    describe('When I am on Bills Page', () => {
        test('Then bill icon in vertical layout should be highlighted', async () => {

            Object.defineProperty(window, 'localStorage', {value: localStorageMock});
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee',
            }));
            const root = document.createElement('div');
            root.setAttribute('id', 'root');
            document.body.append(root);
            router();
            window.onNavigate(ROUTES_PATH.Bills);
            await waitFor(() => screen.getByTestId('icon-window'));
            const windowIcon = screen.getByTestId('icon-window');
            //to-do write expect expression
            expect(windowIcon).toBeTruthy();
        });
        test('Then bills should be ordered from earliest to latest', () => {
            document.body.innerHTML = BillsUI({data: bills});
            const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML);
            const antiChrono = (a, b) => ((a < b) ? 1 : -1);
            const datesSorted = [...dates].sort(antiChrono);
            expect(dates).toEqual(datesSorted);
        });
    });

    describe('When I am on Bils page and I click to New Bill button', () => {
        test('Then, I should see the New Bill page', () => {

            Object.defineProperty(window, 'localStorage', { value: localStorageMock });
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee',
                email: 'e@e',
            }));

            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({pathname});
            }

            document.body.innerHTML = BillsUI({ data: bills });
            const bill = new Bills({
                document,
                onNavigate,
                store: null,
                localStorage: window.localStorage,
            })

            const buttonNewBill = screen.getByTestId('btn-new-bill');
            expect(buttonNewBill).toBeTruthy();

            const handleClickNewBill = jest.fn(() => bill.handleClickNewBill());
            buttonNewBill.addEventListener('click', handleClickNewBill);
            userEvent.click(buttonNewBill);

            expect(handleClickNewBill).toHaveBeenCalled();

            expect(screen.getByText('Envoyer une note de frais')).toBeTruthy();
        })
    })

    describe('When I am on Bills page and I click to an icon Eye', () => {
        test('Then, I should be render details bills', () => {

            Object.defineProperty(window, 'localStorage', { value: localStorageMock });
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee',
                email: 'e@e',
            }));

            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({pathname});
            };

            document.body.innerHTML = BillsUI({ data: bills });
            const bill = new Bills({
                document,
                onNavigate,
                store: null,
                localStorage: window.localStorage,
            })

            // Implémentation d'une fonction simulée pour Jquery
            // sinon une erreur survient : TypeError: $(...).modal is not a function
            $.fn.modal = jest.fn();
            // Par rapport à l'événement de click : $('#modaleFile').modal('show') dans le container/bills.js
            const iconEyeBillElements = screen.getAllByTestId('icon-eye');

            const handleClickEyeIcon = jest.fn((icon) => bill.handleClickIconEye(icon));
            iconEyeBillElements.forEach((icon) => {
                icon.addEventListener('click', handleClickEyeIcon(icon))
            })

            const firstShowBillBtn = iconEyeBillElements[0];
            userEvent.click(firstShowBillBtn)
            expect(handleClickEyeIcon).toHaveBeenCalled();

            const modale = screen.getByText("Justificatif");
            expect(modale).toBeTruthy();
        })
    })
});

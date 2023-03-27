/**
 * @jest-environment jsdom
 */
import { fireEvent, screen } from '@testing-library/dom';


// Mocks
import { localStorageMock } from '../__mocks__/localStorage.js';
import mockStore from '../__mocks__/store.js';
jest.mock('../app/store', () => mockStore);

import NewBillUI from '../views/NewBillUI.js';
import NewBill from '../containers/NewBill.js';
import { ROUTES_PATH, ROUTES } from '../constants/routes.js';
import router from '../app/Router.js';


describe('Given I am connected as an employee', () => {
    describe('When I am on NewBill Page', () => {
        test('Then, I should be render page with form completion for a new bill', () => {
            const html = NewBillUI();
            document.body.innerHTML = html;

            const titlePage = screen.getByText('Envoyer une note de frais');
            expect(titlePage).toBeTruthy();

            const formAddNewBill = screen.getByTestId('form-new-bill');
            expect(formAddNewBill).toBeTruthy();
        });
    });

    describe('When, input file change', () => {
        test('Then, I should be get error for a not good file', () => {
            Object.defineProperty(window, 'localStorage', {value: localStorageMock});
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee',
                email: 'e@e',
            }));

            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({pathname});
            };
            document.body.innerHTML = NewBillUI();

            const newBill = new NewBill({
                document,
                onNavigate,
                store: null,
                localStorage: window.localStorage,
            })

            window.alert = jest.fn((message) => console.log(message));

            const fileInput = screen.getByTestId('file');
            expect(fileInput).toBeTruthy();

            const handleFileEvent = jest.fn((e) => newBill.handleChangeFile(e));
            fileInput.addEventListener('change', handleFileEvent);
            fireEvent.change(fileInput, {
                target: {
                    files: [new File(["video.mp4"], "video.mp4", {type: "video/mp4"})],
                },
            });

            expect(handleFileEvent).toHaveBeenCalled();
            // Es-ce que l'alerte à été appelé ?
            expect(window.alert).toHaveBeenCalled();
        })
    })

    describe('When, input file change', () => {
        test('Then, I should get name for a good file', () => {
            jest.spyOn(mockStore, 'bills');
            Object.defineProperty(window, 'localStorage', { value: localStorageMock });
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee',
                email: 'e@e',
            }));

            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({pathname});
            };
            document.body.innerHTML = NewBillUI();

            const newBill = new NewBill({
                document,
                onNavigate,
                store: mockStore,
                localStorage: window.localStorage,
            })

            const fileInput = screen.getByTestId('file');
            expect(fileInput).toBeTruthy();

            const handleFileEvent = jest.fn((e) => newBill.handleChangeFile(e));
            fileInput.addEventListener('change', handleFileEvent);
            fireEvent.change(fileInput, {
                target: {
                    files: [new File(["goodPicture.png"], "goodPicture.png", {type: "image/png"})],
                },
            });

            expect(handleFileEvent).toHaveBeenCalled();
            // Es-ce que l'alerte à été appelé ?
            expect(fileInput.files[0].name).toBe('goodPicture.png')
        })
    })

    describe("When, I click on the submit button", () => {
        test("Then, the bill should be sent", () => {
            jest.spyOn(mockStore, 'bills');
            Object.defineProperty(window, 'localStorage', {value: localStorageMock});
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee',
                email: 'e@e',
            }));

            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({pathname});
            };
            document.body.innerHTML = NewBillUI();

            const newBill = new NewBill({
                document,
                onNavigate,
                store: mockStore,
                localStorage: window.localStorage,
            })

            const fileInput = screen.getByTestId('file');
            expect(fileInput).toBeTruthy();

            const handleFileEvent = jest.fn((e) => newBill.handleChangeFile(e));
            fileInput.addEventListener('change', handleFileEvent);
            fireEvent.change(fileInput, {
                target: {
                    files: [new File(["goodPicture.png"], "goodPicture.png", {type: "image/png"})],
                },
            });
            expect(handleFileEvent).toHaveBeenCalled();

            const expenseType = screen.getByTestId('expense-type');
            expenseType.value = "Transports";

            const expenseName = screen.getByTestId('expense-name');
            expenseName.value = "test1";

            const expenseAmount = screen.getByTestId('amount');
            expenseAmount.value = 100;

            const expenseDate = screen.getByTestId('datepicker');
            expenseDate.value = "2001-01-01";

            const expenseVAT = screen.getByTestId('vat');
            expenseVAT.value = "";

            const expensePCT = screen.getByTestId('pct');
            expensePCT.value = 20;

            const expenseCommentary = screen.getByTestId('commentary');
            expenseCommentary.value = "plop";

            const handleFormSubmit = jest.fn((event) => newBill.handleSubmit(event));

            const form = screen.getByTestId("form-new-bill");
            form.addEventListener('submit', handleFormSubmit)
            fireEvent.submit(form);

            expect(form).toBeTruthy();
        })
    })

})

describe("Given I am a user connected as Employee", () => {
    describe("When I navigate to Bill page", () => {
        test("fetches New Bills from mock API", async () => {
            beforeEach(() => {
                jest.spyOn(mockStore, "bills");
                Object.defineProperty(window, "localStorage", {
                    value: localStorageMock,
                });
                window.localStorage.setItem(
                    "user",
                    JSON.stringify({
                        type: "Employee",
                        email: "e@e",
                    })
                );
            });
        });
        describe("When an error occurs on API", () => {
            beforeEach(() => {
                jest.spyOn(mockStore, "bills");
                Object.defineProperty(window, "localStorage", { value: localStorageMock });
                window.localStorage.setItem(
                    "user",
                    JSON.stringify({
                        type: "Employee",
                        email: "e@e",
                    })
                );
                const root = document.createElement("div");
                root.setAttribute("id", "root");
                document.body.appendChild(root);
                router();
            });
            test("fetches bills from an API and fails with 404 message error", async () => {
                mockStore.bills.mockImplementationOnce(() => {
                    return {
                        list: () => {
                            return Promise.reject(new Error("Erreur 404"));
                        },
                    };
                });
                window.onNavigate(ROUTES_PATH["Bills"]);
                await new Promise(process.nextTick);
                const message = await screen.getByText(/Erreur 404/);
                expect(message).toBeTruthy();
            });

            test("fetches messages from an API and fails with 500 message error", async () => {
                mockStore.bills.mockImplementationOnce(() => {
                    return {
                        list: () => {
                            return Promise.reject(new Error("Erreur 500"));
                        },
                    };
                });

                window.onNavigate(ROUTES_PATH["Bills"]);
                await new Promise(process.nextTick);
                const message = await screen.getByText(/Erreur 500/);
                expect(message).toBeTruthy();
            })
        })
    })
})


describe("I am connected as an employee and on Bill page", () => {
    test("fetches new Bills from mock API POST", async () => {
        const newBill = {
            id: "47qAXb6fIm2zOKkLzMro",
            vat: "80",
            fileUrl:
                "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
            status: "pending",
            type: "Hôtel et logement",
            commentary: "séminaire billed",
            name: "encore",
            fileName: "preview-facture-free-201801-pdf-1.jpg",
            date: "2004-04-04",
            amount: 400,
            commentAdmin: "ok",
            email: "a@a",
            pct: 20,
        };

        const getSpy = jest.spyOn(mockStore, "post");

        await mockStore.post(newBill);
        expect(getSpy).toHaveBeenCalledTimes(1);
        expect(getSpy).toHaveBeenLastCalledWith(newBill);
    })
})